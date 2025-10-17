import { NextRequest, NextResponse } from "next/server"
import { ChatOpenAI } from "@langchain/openai"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { SystemMessage } from "@langchain/core/messages"
import { convertVercelMessageToLangChainMessage } from "@/lib/message-converters"
import { toUIMessageStream } from "@ai-sdk/langchain"
import { createUIMessageStreamResponse } from "ai"
import { createGoogleDocResume, readGoogleDocContent } from "@/lib/tools/gdocs"
import {
  GmailCreateDraft,
  GmailSendMessage,
} from "@langchain/community/tools/gmail"
import { GmailGetMessage } from "@langchain/community/tools/gmail"
import { GmailSearch } from "@langchain/community/tools/gmail"
import { getAccessToken, withGoogleConnection } from "@/lib/auth0-ai"

const AGENT_SYSTEM_TEMPLATE = `You are ResumeFlow, an intelligent and supportive AI agent that helps users create, review, and optimize resumes tailored to specific job descriptions.

Your Capabilities:
- Access and analyze resumes from Google Docs.
- Rewrite or generate optimized resumes using Google Docs templates.
- Tailor resumes for specific job descriptions provided by the user.
- Generate concise email drafts to send resumes to recruiters via Gmail.

Your Objectives:
- Provide actionable suggestions for each resume section (summary, experience, projects, education, skills).
- Identify and flag weak entries, missing details, or formatting issues.
- Rewrite or reformat text for clarity, impact, and ATS compatibility.
- Ask for missing context (e.g. quantifiable impact, specific tools used, career goals).

Tone & Style:
- Friendly, encouraging, and clear.
- Use concise, high-impact bullet points.
- Avoid jargon unless appropriate for the role/industry.
- Speak with empathy, especially for early-career professionals or career switchers.

Boundaries:
- Do not make up user data (e.g. roles, dates, achievements).
- Ask for confirmation before sending any emails or submitting resumes.
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
        withGoogleConnection(gmailDraft),
        withGoogleConnection(gmailSend),
        withGoogleConnection(gmailSearch),

      ],
      messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
    })

    const eventStream = agent.streamEvents(
      { messages: convertVercelMessageToLangChainMessage(messages) },
      { version: "v2" }
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
