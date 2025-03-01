"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface WebSocketMessage {
    type: string
    data: any
}

export function useWebSocket(url: string) {
    const [isConnected, setIsConnected] = useState(false)
    const [isReconnecting, setIsReconnecting] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const wsRef = useRef<WebSocket | null>(null)
    const reconnectAttempts = useRef(0)
    const maxReconnectAttempts = 5
    const reconnectDelay = 1000 // Start with 1 second delay

    const connect = useCallback(() => {
        try {
            const ws = new WebSocket(url)

            ws.onopen = () => {
                console.log("WebSocket connected")
                setIsConnected(true)
                setIsReconnecting(false)
                setError(null)
                reconnectAttempts.current = 0
            }

            ws.onclose = () => {
                console.log("WebSocket disconnected")
                setIsConnected(false)
                wsRef.current = null

                // Attempt to reconnect if we haven't exceeded max attempts
                if (reconnectAttempts.current < maxReconnectAttempts) {
                    setIsReconnecting(true)
                    reconnectAttempts.current += 1
                    const delay = reconnectDelay * Math.pow(2, reconnectAttempts.current - 1)
                    setTimeout(connect, delay)
                } else {
                    setError(new Error("Failed to connect after maximum attempts"))
                    setIsReconnecting(false)
                }
            }

            ws.onerror = (event) => {
                console.error("WebSocket error:", event)
                setError(new Error("WebSocket error occurred"))
            }

            wsRef.current = ws
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to connect to WebSocket"))
        }
    }, [url])

    useEffect(() => {
        connect()
        return () => {
            if (wsRef.current) {
                wsRef.current.close()
            }
        }
    }, [connect])

    const sendMessage = useCallback((message: WebSocketMessage) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message))
            return true
        }
        return false
    }, [])

    const addMessageListener = useCallback((callback: (message: WebSocketMessage) => void) => {
        if (wsRef.current) {
            wsRef.current.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data)
                    callback(message)
                } catch (err) {
                    console.error("Error parsing WebSocket message:", err)
                }
            }
        }
    }, [])

    return {
        isConnected,
        isReconnecting,
        error,
        sendMessage,
        addMessageListener,
    }
}

