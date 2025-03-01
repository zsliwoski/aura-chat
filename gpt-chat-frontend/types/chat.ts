export type Conversation = {
    id: string
    title: string
    messages: Message[]
    createdAt: Date
    updatedAt: Date
}

export type Message = {
    id: string
    content: string
    role: "user" | "assistant"
    timestamp: Date
    isTyping?: boolean
}

