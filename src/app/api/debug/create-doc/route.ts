import { NextResponse } from "next/server"
import { createGoogleDocResume } from "@/lib/tools/gdocs"
import { auth0 } from "@/lib/auth0"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const token: string | undefined = body.token
    const payload = body.payload ?? {}

    if (!token) {
      return NextResponse.json({ error: "Missing 'token' in request body" }, { status: 400 })
    }

    // Temporarily override token acquisition to use provided token
    ;(auth0 as any).getAccessTokenForConnection = async () => ({ token })

    // Provide sensible defaults; allow overrides via payload
    const defaults = {
      docTitle: "Resume",
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedin_url: "https://www.linkedin.com/in/example",
      github_url: "https://github.com/example",
      summary: "Experienced software engineer with a focus on web applications.",
      experience: [
        {
          role: "Senior Software Engineer",
          company: "TechCorp",
          duration: "2021 — Present",
          bullets: [
            "Led development of key features in a Next.js platform.",
            "Improved performance and reduced bundle size by 30%.",
          ],
        },
        {
          role: "Software Engineer",
          company: "Startup Inc.",
          duration: "2019 — 2021",
          bullets: [
            "Built internal tools to automate deployment workflows.",
            "Collaborated with design to improve UI/UX across products.",
          ],
        },
      ],
      education: [
        { degree: "B.S. Computer Science", institution: "State University", duration: "2015 — 2019" },
      ],
      skills: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "AWS"],
      projects: [
        { name: "Open Source Tool", description: "CLI utility for developer productivity." },
      ],
    }

    const input = { ...defaults, ...payload }

    const url = await createGoogleDocResume.invoke(input as any)
    return NextResponse.json({ url })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Unknown error" }, { status: 500 })
  }
}


