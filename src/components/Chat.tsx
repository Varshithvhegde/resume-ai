"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Send, LogOut, Copy, Check, FileText, Sparkles, User, Settings, MessageSquare } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useChat } from "@ai-sdk/react"
import { useRouter } from "next/navigation"

type ChatProps = {
  githubUrl: string
  userProfile?: {
    email: string
    name?: string
    picture?: string
  }
}

// Enhanced Logo Component
const EnhancedLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg blur-sm opacity-75"></div>
        <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
          <FileText className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ResumeAI
        </span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1">
          Powered by AI
        </span>
      </div>
    </div>
  )
}

// Enhanced Profile Component
const ProfileMenu = ({ profile }: { profile?: { email: string; name?: string; picture?: string } }) => {
  if (!profile) return null

  const getInitials = () => {
    if (profile.name) {
      return profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return profile.email[0].toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
            <AvatarImage src={profile.picture || undefined} alt={profile.name || profile.email} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">{profile.name || 'User'}</p>
            <p className="text-xs leading-none text-gray-600 dark:text-gray-400">
              {profile.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        <DropdownMenuItem onClick={() => window.open('/profile', '_blank')} className="cursor-pointer text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        <DropdownMenuItem asChild>
          <a href="/auth/logout" className="w-full cursor-pointer text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const Chat = ({ githubUrl, userProfile }: ChatProps) => {
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
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Review My Resume",
      description: "Get detailed feedback and suggestions for improvement"
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Improve Formatting",
      description: "Make your resume more professional and visually appealing"
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Suggest Skills",
      description: "Discover relevant skills to add based on your experience"
    }
  ]

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  return (
    <div className='flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900'>
      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <div className='bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 px-6 py-4 sticky top-0 z-10'>
          <div className='flex items-center justify-between max-w-4xl mx-auto'>
            <EnhancedLogo />
            <ProfileMenu profile={userProfile} />
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className='flex-1'>
          <div className='max-w-4xl mx-auto px-6 py-8 space-y-8'>
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className='flex flex-col items-center justify-center min-h-[70vh] space-y-8'>
                <div className='text-center space-y-4'>
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-20"></div>
                    <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-3xl">
                      <FileText className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent'>
                    Welcome to ResumeAI
                  </h1>
                  <p className='text-lg text-gray-600 dark:text-gray-400 max-w-md'>
                    Your AI-powered assistant for creating outstanding resumes
                  </p>
                </div>

                {/* Quick Prompts */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl'>
                  {quickPrompts.map((prompt, idx) => (
                    <Card
                      key={idx}
                      className='group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-gray-200 dark:border-gray-800'
                      onClick={() => handleQuickPrompt(prompt.description)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className='relative p-6 space-y-3'>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          {prompt.icon}
                        </div>
                        <div className="space-y-1">
                          <h3 className='font-semibold text-gray-900 dark:text-white'>
                            {prompt.title}
                          </h3>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {prompt.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((message, index) => (
              <div key={index} className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <Avatar className="h-8 w-8 border-2 border-gray-200 dark:border-gray-700">
                    {message.role === "user" ? (
                      <>
                        <AvatarImage src={userProfile?.picture} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-semibold">
                          {userProfile?.name?.[0]?.toUpperCase() || userProfile?.email[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </>
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                        <Sparkles className="w-4 h-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                    {message.role === "user" ? (userProfile?.name || "You") : "ResumeAI"}
                  </span>
                </div>
                
                {/* Message Content */}
                <div className='group relative ml-11'>
                  <Card className="p-5 border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
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
                              <code className='bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-blue-600 dark:text-blue-400'>
                                {children}
                              </code>
                            ) : (
                              <code className='block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm font-mono text-gray-900 dark:text-gray-100 overflow-x-auto border border-gray-200 dark:border-gray-700'>
                                {children}
                              </code>
                            )
                          },
                          h1: ({ children }) => <h1 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>{children}</h1>,
                          h2: ({ children }) => <h2 className='text-xl font-bold mb-3 text-gray-900 dark:text-white'>{children}</h2>,
                          h3: ({ children }) => <h3 className='text-lg font-bold mb-2 text-gray-900 dark:text-white'>{children}</h3>,
                          strong: ({ children }) => <strong className='font-semibold text-gray-900 dark:text-white'>{children}</strong>,
                          a: ({ children, href }) => (
                            <a href={href} className='text-blue-600 dark:text-blue-400 hover:underline font-medium' target='_blank' rel='noopener noreferrer'>
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
                  </Card>

                  {/* Copy Button - Only for assistant messages */}
                  {message.role === "assistant" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(
                        message.parts
                          .map((part) => (part.type === "text" ? part.text : ""))
                          .join(""),
                        index
                      )}
                      className='absolute -bottom-10 left-0 opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className='w-4 h-4 mr-2 text-green-600 dark:text-green-400' />
                          <span className="text-xs text-green-600 dark:text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className='w-4 h-4 mr-2 text-white' />
                          <span className="text-xs text-white">Copy</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <Avatar className="h-8 w-8 border-2 border-gray-200 dark:border-gray-700">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                      <Sparkles className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                    ResumeAI
                  </span>
                </div>
                <div className='ml-11'>
                  <Card className="p-5 border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 w-fit">
                    <div className='flex gap-1.5'>
                      <div className='w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                      <div className='w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
                      <div className='w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className='bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-6 py-6'>
          <div className='max-w-4xl mx-auto'>
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
                placeholder='Ask me anything about your resume...'
                className='pr-14 py-4 px-5 text-base rounded-2xl border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-900 resize-none min-h-[56px] max-h-[200px] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 shadow-sm'
                disabled={isTyping}
                rows={1}
              />
              <Button
                onClick={handleSend}
                size='icon'
                className='absolute right-2 bottom-2 h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={!input.trim() || isTyping}
              >
                <Send className='w-4 h-4 text-white' />
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat