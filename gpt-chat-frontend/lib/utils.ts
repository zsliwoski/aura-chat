import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Message } from "@/types/chat"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text)
}

export function exportConversation(messages: Message[]) {
  const conversation = messages.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n\n")

  const blob = new Blob([conversation], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `chat-export-${new Date().toISOString().split("T")[0]}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function generateConversationTitle(messages: Message[]): string {
  const firstUserMessage = messages.find((m) => m.role === "user")
  if (!firstUserMessage) return "New Chat"

  // Use the first ~30 characters of the first user message
  return firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "")
}

export function formatDate(date: Date): string {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === now.toDateString()) {
    return "Today"
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  } else {
    return date.toLocaleDateString()
  }
}

