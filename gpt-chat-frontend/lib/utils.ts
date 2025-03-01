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

