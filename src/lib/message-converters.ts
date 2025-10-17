import { UIMessage } from "ai"
import { AIMessage, HumanMessage } from "@langchain/core/messages"

export const convertVercelMessageToLangChainMessage = (
  messages: UIMessage[]
) => {
  return messages.map((message) =>
    message.role == "user"
      ? new HumanMessage(
          message.parts
            .map((part) => (part.type === "text" ? part.text : ""))
            .join("")
        )
      : new AIMessage(
          message.parts
            .map((part) => (part.type === "text" ? part.text : ""))
            .join("")
        )
  )
}
