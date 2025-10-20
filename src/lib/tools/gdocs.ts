/* eslint-disable @typescript-eslint/no-explicit-any */
import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { google } from "googleapis"
import { auth0 } from "@/lib/auth0"
import { extractTextFromGoogleDoc } from "../utils"

// Set max listeners to prevent memory leak warnings
process.setMaxListeners(20)

export const readGoogleDocContent = tool(
  async ({ docId }) => {
    // Get the Google OAuth token for the user
    const { token } = await auth0.getAccessTokenForConnection({
      connection: "google-oauth2",
    })
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: token })

    const docs = google.docs({ version: "v1", auth })

    // Fetch the document
    const response = await docs.documents.get({
      documentId: docId,
    })

    const body = response.data.body?.content || []

    // Extract plain text from the document content
    const blocks = await extractTextFromGoogleDoc(body)

    return {
      blocks, 
    }
  },
  {
    name: "readGoogleDocContent",
    description:
      "Reads and returns plain text content from a Google Docs document by ID with start and end index.",
    schema: z.object({
      docId: z
        .string()
        .describe(
          "The document ID from the Google Docs URL (e.g., from /document/d/<ID>/edit)."
        ),
    }),
  }
)

export const createGoogleDocResume = tool(
  async (input) => {
    const {
      docTitle,
      fullName,
      email,
      phone,
      location,
      linkedin_url,
      github_url,
      summary,
      experience,
      education,
      skills,
      projects,
    } = input


    const { token } = await auth0.getAccessTokenForConnection({
      connection: "google-oauth2",
    })

    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: token })

    const docs = google.docs({ version: "v1", auth })

    const created = await docs.documents.create({
      requestBody: {
        title: `${fullName} - ${docTitle}`,
      },
    })

    const docId = created.data.documentId!

    let index = 1
    const requests: any[] = []

    // Set document margins - narrower for ATS
    requests.push({
      updateDocumentStyle: {
        documentStyle: {
          marginTop: { magnitude: 36, unit: "PT" },
          marginBottom: { magnitude: 36, unit: "PT" },
          marginLeft: { magnitude: 54, unit: "PT" },
          marginRight: { magnitude: 54, unit: "PT" },
        },
        fields: "marginTop,marginBottom,marginLeft,marginRight",
      },
    })

    // Helper functions
    const bold = (startIndex: number, endIndex: number) => {
      requests.push({
        updateTextStyle: {
          range: { startIndex, endIndex },
          textStyle: { bold: true },
          fields: "bold",
        },
      })
    }

    const center = (startIndex: number, endIndex: number) => {
      requests.push({
        updateParagraphStyle: {
          range: { startIndex, endIndex },
          paragraphStyle: { alignment: "CENTER" },
          fields: "alignment",
        },
      })
    }

    const addHorizontalLine = () => {
      requests.push({
        insertText: {
          text: "─".repeat(70) + "\n",
          location: { index },
        },
      })
      requests.push({
        updateTextStyle: {
          range: { startIndex: index, endIndex: index + 71 },
          textStyle: {
            foregroundColor: {
              color: {
                rgbColor: { red: 0.7, green: 0.7, blue: 0.7 },
              },
            },
            fontSize: { magnitude: 8, unit: "PT" },
          },
          fields: "foregroundColor,fontSize",
        },
      })
      index += 71
    }

    const addSection = (title: string) => {
      requests.push({
        insertText: {
          text: `${title.toUpperCase()}\n`,
          location: { index },
        },
      })

      requests.push({
        updateTextStyle: {
          range: { startIndex: index, endIndex: index + title.length },
          textStyle: {
            bold: true,
            foregroundColor: {
              color: {
                rgbColor: { red: 0.2, green: 0.2, blue: 0.2 },
              },
            },
            fontSize: { magnitude: 12, unit: "PT" },
            weightedFontFamily: { fontFamily: "Arial" },
          },
          fields: "bold,fontSize,foregroundColor,weightedFontFamily",
        },
      })
      bold(index, index + title.length)
      index += title.length + 1

      // Add underline below section
      addHorizontalLine()
    }

    const addText = (text: string, size: number = 10) => {
      requests.push({
        insertText: {
          text,
          location: { index },
        },
      })
      requests.push({
        updateTextStyle: {
          range: { startIndex: index, endIndex: index + text.length },
          textStyle: {
            fontSize: { magnitude: size, unit: "PT" },
            weightedFontFamily: { fontFamily: "Arial" },
            foregroundColor: {
              color: {
                rgbColor: { red: 0.2, green: 0.2, blue: 0.2 },
              },
            },
          },
          fields: "fontSize,weightedFontFamily,foregroundColor",
        },
      })
      index += text.length
    }

    const addBullet = (text: string) => {
      const prevIndex = index
      addText(`${text}\n`, 10)
      requests.push({
        createParagraphBullets: {
          range: { startIndex: prevIndex, endIndex: index },
          bulletPreset: "BULLET_DISC_CIRCLE_SQUARE",
        },
      })
    }

    const addCompanyHeader = (company: string, duration: string) => {
      const startIdx = index
      addText(company, 11)
      bold(startIdx, index)
      
      const spacer = " ".repeat(5)
      addText(spacer)
      
      const durationStart = index
      addText(duration, 10)
      requests.push({
        updateTextStyle: {
          range: { startIndex: durationStart, endIndex: index },
          textStyle: {
            foregroundColor: {
              color: {
                rgbColor: { red: 0.4, green: 0.4, blue: 0.4 },
              },
            },
            italic: true,
          },
          fields: "foregroundColor,italic",
        },
      })
      
      addText("\n")
    }

    const addRole = (text: string) => {
      const prevIndex = index
      addText(`${text}\n`, 10)
      requests.push({
        updateTextStyle: {
          range: { startIndex: prevIndex, endIndex: index },
          textStyle: {
            italic: true,
          },
          fields: "italic",
        },
      })
    }

    // ===== NAME HEADER =====
    const nameStart = index
    addText(`${fullName}\n`, 18)
    center(nameStart, index)
    bold(nameStart, index - 1)

    // ===== CONTACT INFO =====
    const contactLine = `${email} | ${phone} | ${location}`
    let prevIndex = index
    addText(`${contactLine}\n`, 9)
    center(prevIndex, index)

    prevIndex = index
    const socialLinksLine = `${linkedin_url} | ${github_url}`
    addText(`${socialLinksLine}\n\n`, 9)
    center(prevIndex, index)

    // ===== PROFESSIONAL SUMMARY SECTION =====
    // Only add if summary exists and is not empty
    if (summary && summary.trim().length > 0) {
      addSection("Professional Summary")
      addText(`${summary.trim()}\n\n`, 10)
    }

    // ===== EXPERIENCE SECTION =====
    if (experience && experience.length > 0) {
      addSection("Professional Experience")
      for (const exp of experience) {
        addCompanyHeader(exp.company, exp.duration)
        addRole(exp.role)
        for (const bullet of exp.bullets) {
          if (bullet && bullet.trim()) {
            addBullet(bullet)
          }
        }
        addText("\n")
      }
    }

    // ===== EDUCATION SECTION =====
    if (education && education.length > 0) {
      addSection("Education")
      for (const item of education) {
        addCompanyHeader(item.institution, item.duration)
        addRole(item.degree)
        addText("\n")
      }
    }

    // ===== PROJECTS SECTION =====
    if (projects && projects.length > 0) {
      addSection("Projects")
      for (const project of projects) {
        const projStart = index
        addText(project.name, 11)
        bold(projStart, index)
        addText(` - ${project.description}\n`)
        addText("\n")
      }
    }

    // ===== SKILLS SECTION =====
    if (skills && skills.length > 0) {
      addSection("Technical Skills")
      addText(`${skills.join(" • ")}\n`)
    }

    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: { requests },
    })

    return `https://docs.google.com/document/d/${docId}/edit`
  },
  {
    name: "createGoogleDocResume",
    description:
      "Creates an ATS-friendly, professional resume using Google Docs and returns the document URL. Include summary field if user has a professional summary in their profile.",
    schema: z.object({
      docTitle: z.string().describe("The title of the document."),
      fullName: z.string().describe("Full name of the user."),
      email: z.string().describe("Email address of the user."),
      phone: z.string().describe("Phone number of the user."),
      location: z.string().describe("Location of the user."),
      linkedin_url: z.string().url().describe("LinkedIn URL of the user."),
      github_url: z.string().url().describe("GitHub URL of the user."),
      summary: z.string().describe("Professional summary or objective statement. Can be empty string if not available."),
      experience: z.array(
        z.object({
          role: z.string().describe("Job title of the work experience."),
          company: z.string().describe("Company name of the work experience."),
          duration: z.string().describe("Duration of the work experience."),
          bullets: z
            .array(z.string())
            .describe("Bullet points of the work experience."),
        })
      ),
      education: z.array(
        z.object({
          degree: z.string(),
          institution: z.string(),
          duration: z.string(),
        })
      ),
      skills: z.array(z.string()),
      projects: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
        })
      ),
    }),
  }
)