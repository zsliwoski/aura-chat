"use client"

import type React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { Sparkles, Send, Menu, Plus, User, Settings, LogOut, Download, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { SettingsDialog } from "@/components/settings-dialog"
import { ConnectionStatus } from "@/components/connection-status"
import { useWebSocket } from "@/lib/use-websocket"
import { exportConversation } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism"
import remarkGfm from "remark-gfm"
import { useTheme } from "next-themes"
import type { Conversation } from "@/types/chat"
import { generateConversationTitle, formatDate } from "@/lib/utils"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  isTyping?: boolean
}

const allSuggestions = [
  "Tell me a joke",
  "Explain quantum computing",
  "Write a poem",
  "Help me debug my code",
  "Translate to Spanish",
  "What's the meaning of life?",
  "How do I learn React?",
  "Write a story",
  "Explain blockchain",
  "Give me a recipe",
  "Solve a math problem",
  "Create a workout plan",
  "Design tips",
  "Career advice",
  "Book recommendations",
  "Movie suggestions",
  "Travel planning help",
  "Gardening tips",
  "Music theory basics",
  "Photography advice",
]

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8080/api/chat"

export default function ChatInterface() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== "undefined" ? window.innerWidth >= 768 : true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showSettings, setShowSettings] = useState(false)

  // Add input validation state
  const [inputError, setInputError] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const { isConnected, isReconnecting, error, sendMessage, addMessageListener } = useWebSocket(WEBSOCKET_URL)

  const [showSuggestions, setShowSuggestions] = useState(true)
  const suggestions = useMemo(() => {
    const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 5)
  }, [])

  const { theme } = useTheme()

  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  useEffect(() => {
    addMessageListener((message) => {
      if (message.type === "message") {
        // NOTE: temporary workaround to remove <think> tags from response
        // Once streaming is added this will turn into something more useful
        const content = message.data.message.content.replace(/<think>.*?<\/think>/, '');
        const assistantMessage: Message = {
          id: Date.now().toString(),
          content: content,
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
      }
    })
  }, [addMessageListener])

  // Validate input before submission
  const validateInput = (text: string) => {
    if (text.trim().length === 0) {
      setInputError("Message cannot be empty")
      return false
    }
    if (text.length > 2000) {
      setInputError("Message is too long (maximum 2000 characters)")
      return false
    }
    // Check for spam-like behavior (repeated characters)
    const repeatedCharsRegex = /(.)\1{9,}/
    if (repeatedCharsRegex.test(text)) {
      setInputError("Message contains too many repeated characters")
      return false
    }
    setInputError(null)
    return true
  }

  const createNewChat = () => {
    // Save current conversation if it exists and has messages
    if (currentConversationId && messages.length > 1) {
      const currentConversation = conversations.find((c) => c.id === currentConversationId)
      if (currentConversation) {
        setConversations((prev) =>
          prev.map((c) => (c.id === currentConversationId ? { ...c, messages, updatedAt: new Date() } : c)),
        )
      } else {
        const newConversation: Conversation = {
          id: currentConversationId,
          title: generateConversationTitle(messages),
          messages,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        setConversations((prev) => [...prev, newConversation])
      }
    }

    // Start new conversation
    const newId = Date.now().toString()
    setCurrentConversationId(newId)
    setMessages([
      {
        id: "1",
        content: "Hello! How can I help you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])
    setShowSuggestions(true)
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  const loadConversation = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId)
    if (conversation) {
      setCurrentConversationId(conversationId)
      setMessages(conversation.messages)
      setShowSuggestions(false)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) {
      setInputError("Not connected to server")
      return
    }
    if (isLoading) {
      setInputError("Please wait for the previous message to complete")
      return
    }
    if (!validateInput(input)) {
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setShowSuggestions(false)
    setInput("")
    setIsLoading(true)

    sendMessage({
      type: "message",
      data: {
        content: input,
      },
    })
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const renderMessageContent = (message: Message) => {
    if (message.role === "assistant" && message.isTyping && message.content === "") {
      return (
        <div className="flex space-x-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }}></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "150ms" }}></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "300ms" }}></div>
        </div>
      )
    }

    return (
      <div className={cn("markdown-content", message.isTyping ? "relative" : "")}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "")
              return !inline && match ? (
                <div className="relative">
                  <SyntaxHighlighter
                    {...props}
                    style={theme === "dark" ? oneDark : oneLight}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md !bg-secondary/10 !p-4 !my-4"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    onClick={() => {
                      const blob = new Blob([String(children)], { type: "text/plain" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `snippet.${match[1]}`
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)
                    }}
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download code</span>
                  </Button>
                </div>
              ) : (
                <code {...props} className={cn("rounded-md bg-secondary/10 px-1.5 py-0.5", className)}>
                  {children}
                </code>
              )
            },
            p({ children }) {
              return <p className="mb-4 last:mb-0">{children}</p>
            },
            a({ children, href }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-words"
                >
                  {children}
                </a>
              )
            },
            ul({ children }) {
              return <ul className="list-disc pl-6 mb-4 last:mb-0">{children}</ul>
            },
            ol({ children }) {
              return <ol className="list-decimal pl-6 mb-4 last:mb-0">{children}</ol>
            },
            li({ children }) {
              return <li className="mb-1 last:mb-0">{children}</li>
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-4 border-primary/30 pl-4 italic mb-4 last:mb-0">{children}</blockquote>
              )
            },
            h1({ children }) {
              return <h1 className="text-2xl font-bold mb-4 last:mb-0">{children}</h1>
            },
            h2({ children }) {
              return <h2 className="text-xl font-bold mb-3 last:mb-0">{children}</h2>
            },
            h3({ children }) {
              return <h3 className="text-lg font-bold mb-2 last:mb-0">{children}</h3>
            },
            table({ children }) {
              return (
                <div className="overflow-x-auto mb-4 last:mb-0">
                  <table className="min-w-full divide-y divide-secondary/20">{children}</table>
                </div>
              )
            },
            th({ children }) {
              return <th className="px-4 py-2 text-left font-semibold bg-secondary/5">{children}</th>
            },
            td({ children }) {
              return <td className="px-4 py-2 border-t border-secondary/10">{children}</td>
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
        {message.isTyping && <span className="absolute -right-1 inline-block animate-cursor-blink">▋</span>}
      </div>
    )
  }

  // Set up scroll observer
  useEffect(() => {
    if (!chatContainerRef.current) return

    const container = chatContainerRef.current
    const observer = new MutationObserver(() => {
      const shouldAutoScroll = container.scrollTop + container.clientHeight >= container.scrollHeight - 100
      if (shouldAutoScroll) {
        container.scrollTop = container.scrollHeight
      }
    })

    observer.observe(container, {
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [])

  // Initial scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const copyToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedMessageId(messageId)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  const renderConversations = () => {
    const groupedConversations = conversations.reduce(
      (acc, conversation) => {
        const dateGroup = formatDate(conversation.createdAt)
        if (!acc[dateGroup]) {
          acc[dateGroup] = []
        }
        acc[dateGroup].push(conversation)
        return acc
      },
      {} as Record<string, Conversation[]>,
    )

    return Object.entries(groupedConversations).map(([dateGroup, groupConversations]) => (
      <div key={dateGroup}>
        <div className="mb-2 px-2 text-xs font-medium text-secondary/60 dark:text-tertiary/60">{dateGroup}</div>
        {groupConversations.map((conversation) => (
          <Button
            key={conversation.id}
            variant="ghost"
            className={cn(
              "mb-1 w-full justify-start truncate text-left text-secondary dark:text-tertiary hover:bg-primary/10 transition-all duration-200 hover:translate-x-1",
              currentConversationId === conversation.id && "bg-primary/10",
            )}
            onClick={() => loadConversation(conversation.id)}
          >
            {conversation.title}
          </Button>
        ))}
      </div>
    ))
  }

  return (
    <div className="flex h-screen bg-tertiary/20 dark:bg-dark-bg transition-colors duration-300">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-light-bg shadow-lg transition-all duration-300 ease-in-out dark:bg-dark-bg dark:border-r dark:border-secondary/20 md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:static",
        )}
      >
        <div className="flex h-full flex-col">
          {/* New Chat Button */}
          <div className="p-4">
            <Button
              className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02]"
              onClick={createNewChat}
            >
              <Plus size={16} />
              New Chat
            </Button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-2">{renderConversations()}</div>

          {/* User Section */}
          <div className="border-t border-tertiary dark:border-secondary/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="border-2 border-primary transition-all duration-300 hover:scale-110 flex items-center justify-center">
                  <User size={24} className="text-secondary dark:text-tertiary" />
                </Avatar>
                <span className="text-sm font-medium text-secondary dark:text-tertiary">John Doe</span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(true)}
                  className="text-secondary dark:text-tertiary hover:bg-primary/10 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <Settings size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-secondary dark:text-tertiary hover:bg-primary/10 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <LogOut size={18} />
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-tertiary dark:border-secondary/20 bg-light-bg dark:bg-dark-bg p-4 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-secondary dark:text-tertiary hover:bg-primary/10 transition-all duration-200"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="font-medium text-secondary dark:text-tertiary">ChatAI</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-secondary dark:text-tertiary hover:bg-primary/10 transition-all duration-200"
              onClick={() => exportConversation(messages)}
              title="Export conversation"
            >
              <Download size={18} />
            </Button>
            <ConnectionStatus isConnected={isConnected} isReconnecting={isReconnecting} />
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
          <div className="mx-auto max-w-3xl">
            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                Connection error: {error.message}. Please try refreshing the page.
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn("mb-6 flex flex-col group", message.role === "user" ? "items-end" : "items-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] md:max-w-[75%] rounded-lg p-4 shadow-md transition-shadow duration-300 hover:shadow-lg animate-fade-in group relative select-text",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-light-bg dark:bg-muted-dark text-secondary dark:text-tertiary",
                    "after:absolute after:inset-0 after:rounded-lg after:transition-[transform,opacity] after:duration-500 hover:after:scale-[1.02] hover:after:opacity-0 after:opacity-100 after:bg-white/5 relative overflow-hidden",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {renderMessageContent(message)}
                </div>
                {message.role === "assistant" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(message.content, message.id)}
                    className={cn(
                      "mt-2 text-xs text-secondary/60 dark:text-tertiary/60 hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-200",
                      "active:scale-95",
                      copiedMessageId === message.id && "text-primary",
                    )}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    {copiedMessageId === message.id ? "Copied!" : "Copy response"}
                  </Button>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="mb-6 flex items-start">
                <div className="max-w-[85%] md:max-w-[75%] rounded-lg p-4 shadow-md bg-light-bg dark:bg-muted-dark animate-fade-in">
                  <div className="flex space-x-2">
                    <div
                      className="h-3 w-3 animate-bounce rounded-full bg-primary"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-3 w-3 animate-bounce rounded-full bg-primary"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-3 w-3 animate-bounce rounded-full bg-primary"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-tertiary dark:border-secondary/20 bg-light-bg dark:bg-dark-bg p-4 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
            {showSuggestions && (
              <div className="mb-4 flex flex-wrap gap-2 justify-center">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setInput(suggestion)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-full border border-tertiary/50 dark:border-secondary/30",
                      "bg-light-bg dark:bg-dark-bg text-secondary/70 dark:text-tertiary/70",
                      "hover:border-primary/50 hover:text-primary hover:scale-105",
                      "transition-all duration-200 animate-fade-in",
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  if (inputError) validateInput(e.target.value)
                }}
                placeholder={isConnected ? "Message ChatAI..." : "Connecting to server..."}
                disabled={!isConnected}
                className={cn(
                  "min-h-[60px] resize-none pr-12 border-tertiary bg-light-bg text-secondary focus:border-primary focus:ring-primary/20 dark:border-secondary/30 dark:bg-dark-bg dark:text-tertiary transition-all duration-200 focus:scale-[1.01]",
                  inputError && "border-destructive focus:border-destructive focus:ring-destructive/20",
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute bottom-2 right-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                disabled={!input.trim() || isLoading || !isConnected}
              >
                <Send size={18} />
              </Button>
            </div>
            {inputError && <p className="mt-2 text-sm text-destructive">{inputError}</p>}
            <p className="mt-2 text-center text-xs text-secondary/60 dark:text-tertiary/60">
              ChatAI can make mistakes. Consider checking important information.
            </p>
          </form>
        </div>
      </div>
      {showSettings && <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />}
    </div>
  )
}

