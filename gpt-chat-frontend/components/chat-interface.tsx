"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { Sparkles, Send, Menu, Plus, User, Settings, LogOut, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { SettingsDialog } from "@/components/settings-dialog"
import { ConnectionStatus } from "@/components/connection-status"
import { useWebSocket } from "@/lib/use-websocket"
import { CopyButton } from "@/components/copy-button"
import { exportConversation } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import remarkGfm from "remark-gfm"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  isTyping?: boolean
}

const suggestions = [
  "Tell me a joke",
  "Explain quantum computing",
  "Write a poem",
  "Help me debug my code",
  "Translate to Spanish",
]

const WEBSOCKET_URL = process.env.CHAT_WEBSOCKET_URL || "ws://localhost:3000/api/chat"

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

  const { isConnected, isReconnecting, error, sendMessage, addMessageListener } = useWebSocket(WEBSOCKET_URL)

  useEffect(() => {
    addMessageListener((message) => {
      if (message.type === "message") {
        setMessages((prev) => [...prev, message.data])
        setIsLoading(false)
      }
    })
  }, [addMessageListener])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !isConnected) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Send message through WebSocket
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
                <SyntaxHighlighter
                  {...props}
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-md !bg-secondary/10 !p-4 !my-4"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
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
            <Button className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02]">
              <Plus size={16} />
              New Chat
            </Button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="mb-2 px-2 text-xs font-medium text-secondary/60 dark:text-tertiary/60">Today</div>
            <Button
              variant="ghost"
              className="mb-1 w-full justify-start truncate text-left text-secondary dark:text-tertiary hover:bg-primary/10 transition-all duration-200 hover:translate-x-1"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setSidebarOpen(false)
                }
              }}
            >
              Understanding quantum computing
            </Button>
            <Button
              variant="ghost"
              className="mb-1 w-full justify-start truncate text-left text-secondary dark:text-tertiary hover:bg-primary/10 transition-all duration-200 hover:translate-x-1"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setSidebarOpen(false)
                }
              }}
            >
              Creative writing prompts
            </Button>

            <div className="mb-2 mt-4 px-2 text-xs font-medium text-secondary/60 dark:text-tertiary/60">Yesterday</div>
            <Button
              variant="ghost"
              className="mb-1 w-full justify-start truncate text-left text-secondary dark:text-tertiary hover:bg-primary/10 transition-all duration-200 hover:translate-x-1"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setSidebarOpen(false)
                }
              }}
            >
              Python code examples
            </Button>
            <Button
              variant="ghost"
              className="mb-1 w-full justify-start truncate text-left text-secondary dark:text-tertiary hover:bg-primary/10 transition-all duration-200 hover:translate-x-1"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setSidebarOpen(false)
                }
              }}
            >
              Travel recommendations
            </Button>
          </div>

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
              <span className="font-medium text-secondary dark:text-tertiary">AuraChat</span>
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
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-3xl">
            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                Connection error: {error.message}. Please try refreshing the page.
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn("mb-6 flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-4 shadow-md transition-shadow duration-300 hover:shadow-lg active:scale-[0.98] cursor-pointer animate-fade-in group relative",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground active:bg-primary/95"
                      : "bg-light-bg dark:bg-muted-dark text-secondary dark:text-tertiary active:bg-tertiary/10 dark:active:bg-muted-dark/90",
                    "after:absolute after:inset-0 after:rounded-lg after:transition-[transform,opacity] after:duration-500 hover:after:scale-[1.02] hover:after:opacity-0 after:opacity-100 after:bg-white/5 relative overflow-hidden",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => {
                    const ripple = document.createElement("div")
                    ripple.className = "absolute inset-0 bg-white/20 animate-ripple rounded-lg"
                    const target = event?.currentTarget as HTMLElement
                    target.appendChild(ripple)
                    setTimeout(() => ripple.remove(), 1000)
                  }}
                >
                  {message.role === "assistant" && <CopyButton text={message.content} />}
                  {renderMessageContent(message)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-tertiary dark:border-secondary/20 bg-light-bg dark:bg-dark-bg p-4 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
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
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isConnected ? "Message AuraChat..." : "Connecting to server..."}
                disabled={!isConnected}
                className="min-h-[60px] resize-none pr-12 border-tertiary bg-light-bg text-secondary focus:border-primary focus:ring-primary/20 dark:border-secondary/30 dark:bg-dark-bg dark:text-tertiary transition-all duration-200 focus:scale-[1.01]"
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
            <p className="mt-2 text-center text-xs text-secondary/60 dark:text-tertiary/60">
              AuraChat can make mistakes. Consider checking important information.
            </p>
          </form>
        </div>
      </div>
      {showSettings && <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />}
    </div>
  )
}

