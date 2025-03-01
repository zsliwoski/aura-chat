import { Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConnectionStatusProps {
    isConnected: boolean
    isReconnecting: boolean
}

export function ConnectionStatus({ isConnected, isReconnecting }: ConnectionStatusProps) {
    return (
        <div className="flex items-center gap-2">
            {isConnected ? (
                <Wifi className="h-4 w-4 text-primary animate-pulse" />
            ) : (
                <WifiOff className="h-4 w-4 text-destructive animate-pulse" />
            )}
            <span
                className={cn("text-xs", isConnected ? "text-primary" : "text-destructive", isReconnecting && "animate-pulse")}
            >
                {isReconnecting ? "Reconnecting..." : isConnected ? "Connected" : "Disconnected"}
            </span>
        </div>
    )
}

