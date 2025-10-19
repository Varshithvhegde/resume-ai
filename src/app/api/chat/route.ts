// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server"
import { ChatOpenAI } from "@langchain/openai"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { SystemMessage } from "@langchain/core/messages"
import { convertVercelMessageToLangChainMessage } from "@/lib/message-converters"
import { toUIMessageStream } from "@ai-sdk/langchain"
import { createUIMessageStreamResponse } from "ai"
import { createGoogleDocResume, readGoogleDocContent } from "@/lib/tools/gdocs"
import { getUserProfile, saveUserProfile } from "@/lib/tools/profile"
import {
  GmailCreateDraft,
  GmailSendMessage,
  GmailSearch,
} from "@langchain/community/tools/gmail"
import { getAccessToken, withGoogleConnection } from "@/lib/auth0-ai"
process.setMaxListeners(20)
const AGENT_SYSTEM_TEMPLATE = `You are ResumeFlow, an intelligent and supportive AI agent that helps users create, review, and optimize resumes tailored to specific job descriptions.

Your Capabilities:
- Access and analyze resumes from Google Docs.
- Retrieve and update user profile information stored in the database (personal info, experience, education, projects, skills).
- Rewrite or generate optimized resumes using Google Docs templates.
- Tailor resumes for specific job descriptions provided by the user.
- Generate concise email drafts to send resumes to recruiters via Gmail.

Your Objectives:
- When users ask about their information, use the getUserProfile tool ONCE to retrieve their stored data.
- Provide actionable suggestions for each resume section (summary, experience, projects, education, skills).
- Identify and flag weak entries, missing details, or formatting issues.
- Rewrite or reformat text for clarity, impact, and ATS compatibility.
- Ask for missing context (e.g. quantifiable impact, specific tools used, career goals).
- When users want to update their profile, use the saveUserProfile tool to store the information.
- When creating a resume, fetch the user's profile ONCE using getUserProfile to get all their information.

Important Guidelines:
- Use getUserProfile tool only ONCE per conversation to check if user data exists.
- When creating a Google Doc resume, use the data from getUserProfile tool combined with any additional context the user provides.
- If the user asks to update specific sections (like adding a new job or skill), fetch their current profile ONCE, modify it, and save it back using saveUserProfile.
- Encourage users to keep their profile updated in the /profile page for better resume generation.
- Do not repeatedly call the same tool in a loop - each tool should be called only when necessary.

Tone & Style:
- Friendly, encouraging, and clear.
- Use concise, high-impact bullet points.
- Avoid jargon unless appropriate for the role/industry.
- Speak with empathy, especially for early-career professionals or career switchers.

Boundaries:
- Do not make up user data (e.g. roles, dates, achievements).
- Ask for confirmation before sending any emails or submitting resumes.
- Never modify user data without explicit permission.
- Do not call the same tool multiple times unnecessarily.
`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages } = body

    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
    })

    const gmailParams = {
      credentials: {
        accessToken: getAccessToken,
      },
    }

    const gmailDraft = new GmailCreateDraft(gmailParams)
    const gmailSend = new GmailSendMessage(gmailParams)
    const gmailSearch = new GmailSearch(gmailParams)

    const agent = createReactAgent({
      llm,
      tools: [
        readGoogleDocContent,
        createGoogleDocResume,
        getUserProfile,
        saveUserProfile,
        withGoogleConnection(gmailDraft),
        withGoogleConnection(gmailSend),
        withGoogleConnection(gmailSearch),
      ],
      messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
    })

    const eventStream = agent.streamEvents(
      { messages: convertVercelMessageToLangChainMessage(messages) },
      { 
        version: "v2",
        recursionLimit: 100
      }
    )

    return createUIMessageStreamResponse({
      stream: toUIMessageStream(eventStream),
    })
  } catch (e: unknown) {
    console.error(e)

    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 })
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}