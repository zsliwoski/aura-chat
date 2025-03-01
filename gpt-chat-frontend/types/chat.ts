export type Message = {
    id: string
    content: string
    role: "user" | "assistant"
    timestamp: Date
    isTyping?: boolean
}

