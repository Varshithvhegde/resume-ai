"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, LogOut, Copy, Check, Sparkles } from "lucide-react"
import Logo from "./ui/logo"
import ReactMarkdown from "react-markdown"
import { useChat } from "@ai-sdk/react"

type ChatProps = {
  githubUrl: string
}

const Chat = ({ githubUrl }: ChatProps) => {
  const [input, setInput] = useState<string>("")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isTyping, setIsTyping] = useState(false)

  const { messages, sendMessage, status } = useChat()

  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLDivElement | null
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [messages])

  // Set typing indicator based on status
  useEffect(() => {
    setIsTyping(status === "submitted" || status === "streaming")
  }, [status])

  const handleSend = () => {
    if (!input.trim()) return

    sendMessage({ text: input })
      .then(() => {
        setInput("")
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      })
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index)
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      })
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }

  const quickPrompts = [
    "Can you review my resume and suggest improvements?",
    "Help me improve the formatting of my resume",
    "What skills should I add to my resume?",
  ]

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  return (
    <div className='flex h-screen bg-white dark:bg-gray-950'>
      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col'>
        {/* Simple Header */}
        <div className='bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-4 py-3'>
          <div className='flex items-center justify-between max-w-3xl mx-auto'>
            <div className='flex items-center gap-3'>
              <Logo mode='dark' />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className='hover:bg-gray-100 dark:hover:bg-gray-800'
              asChild
            >
              <a href='/auth/logout'>
                <LogOut className='w-5 h-5 text-gray-700 dark:text-gray-300' />
              </a>
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className='flex-1'>
          <div className='max-w-3xl mx-auto px-4 py-6 space-y-6'>
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className='flex flex-col items-center justify-center min-h-[60vh] space-y-6'>
                <div className='text-center space-y-3'>
                  <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                    How can I help you today?
                  </h2>
                  <p className='text-gray-600 dark:text-gray-400 max-w-md'>
                    I'm here to help you create and improve your resume.
                  </p>
                </div>

                {/* Quick Prompts */}
                <div className='grid grid-cols-1 gap-2 w-full max-w-2xl'>
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickPrompt(prompt)}
                      className='p-4 text-left rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'
                    >
                      <span className='text-sm text-gray-700 dark:text-gray-300'>
                        {prompt}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((message, index) => (
              <div key={index} className='space-y-2'>
                {/* Role Label */}
                <div className='text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide'>
                  {message.role === "user" ? "You" : "ResumeAI"}
                </div>
                
                {/* Message Content */}
                <div className='group relative'>
                  <div className='text-gray-900 dark:text-gray-100 leading-7'>
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className='mb-4 last:mb-0'>{children}</p>,
                        ul: ({ children }) => <ul className='list-disc ml-6 mb-4 space-y-2'>{children}</ul>,
                        ol: ({ children }) => <ol className='list-decimal ml-6 mb-4 space-y-2'>{children}</ol>,
                        li: ({ children }) => <li className='text-gray-900 dark:text-gray-100'>{children}</li>,
                        code: ({ children, className }) => {
                          const isInline = !className
                          return isInline ? (
                            <code className='bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100'>
                              {children}
                            </code>
                          ) : (
                            <code className='block bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm text-gray-900 dark:text-gray-100 overflow-x-auto'>
                              {children}
                            </code>
                          )
                        },
                        h1: ({ children }) => <h1 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>{children}</h1>,
                        h2: ({ children }) => <h2 className='text-xl font-bold mb-3 text-gray-900 dark:text-white'>{children}</h2>,
                        h3: ({ children }) => <h3 className='text-lg font-bold mb-2 text-gray-900 dark:text-white'>{children}</h3>,
                        strong: ({ children }) => <strong className='font-semibold text-gray-900 dark:text-white'>{children}</strong>,
                        a: ({ children, href }) => (
                          <a href={href} className='text-blue-600 dark:text-blue-400 hover:underline' target='_blank' rel='noopener noreferrer'>
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {message.parts
                        .map((part) => (part.type === "text" ? part.text : ""))
                        .join("")}
                    </ReactMarkdown>
                  </div>

                  {/* Copy Button - Only for assistant messages */}
                  {message.role === "assistant" && (
                    <button
                      onClick={() => handleCopy(
                        message.parts
                          .map((part) => (part.type === "text" ? part.text : ""))
                          .join(""),
                        index
                      )}
                      className='absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
                      title='Copy to clipboard'
                    >
                      {copiedIndex === index ? (
                        <Check className='w-4 h-4 text-green-600 dark:text-green-400' />
                      ) : (
                        <Copy className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className='space-y-2'>
                <div className='text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide'>
                  ResumeAI
                </div>
                <div className='flex gap-1'>
                  <div className='w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                  <div className='w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
                  <div className='w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className='bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 px-4 py-4'>
          <div className='max-w-3xl mx-auto'>
            <div className='relative'>
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !!input.trim()) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder='Message ResumeAI...'
                className='pr-12 py-3 text-base rounded-xl border border-gray-300 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-600 bg-white dark:bg-gray-900 resize-none min-h-[52px] max-h-[200px] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500'
                disabled={isTyping}
                rows={1}
              />
              <Button
                onClick={handleSend}
                size='icon'
                className='absolute right-2 bottom-2 rounded-lg bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100'
                disabled={!input.trim() || isTyping}
              >
                <Send className='w-4 h-4 text-white dark:text-gray-900' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat