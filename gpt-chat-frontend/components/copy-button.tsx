"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { copyToClipboard } from "@/lib/utils"

interface CopyButtonProps {
    text: string
}

export function CopyButton({ text }: CopyButtonProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await copyToClipboard(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-2 right-2 bg-background/50 backdrop-blur-sm"
            onClick={handleCopy}
        >
            {copied ? (
                <Check className="h-4 w-4 text-primary" />
            ) : (
                <Copy className="h-4 w-4 text-secondary dark:text-tertiary" />
            )}
        </Button>
    )
}

