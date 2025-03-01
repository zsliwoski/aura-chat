"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { signIn } from "next-auth/react"
import Image from "next/image"


export default function LoginForm() {
  const [isHovering, setIsHovering] = useState(false)

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-tertiary/30 to-tertiary/10 px-4 dark:from-dark-bg dark:to-dark-bg/95 transition-colors duration-300">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md animate-fade-in bg-light-bg dark:bg-dark-bg dark:border-secondary/20 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <div
              className="rounded-full bg-primary/10 p-3 transition-all duration-300"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <MessageSquare
                className={`h-8 w-8 text-primary transition-transform duration-300 ${isHovering ? "scale-110 rotate-12" : ""
                  }`}
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-secondary dark:text-tertiary">Welcome to AuraChat</CardTitle>
          <CardDescription className="text-secondary/70 dark:text-tertiary/70">
            Sign in to start chatting with Aura
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border transition-all duration-200 hover:scale-[1.02]"
            onClick={() => handleSocialLogin("google")}
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} className="mr-2" />
            Continue with Google
          </Button>
          <Button
            className="w-full bg-[#24292F] hover:bg-[#24292F]/90 text-white transition-all duration-200 hover:scale-[1.02]"
            onClick={() => handleSocialLogin("github")}
          >
            <Image src="/github.svg" alt="GitHub" width={20} height={20} className="mr-2" />
            Continue with GitHub
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-tertiary dark:border-secondary/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-light-bg dark:bg-dark-bg px-2 text-secondary/70 dark:text-tertiary/70">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            className="w-full bg-[#4267B2] hover:bg-[#4267B2]/90 text-white transition-all duration-200 hover:scale-[1.02]"
            onClick={() => handleSocialLogin("facebook")}
          >
            <Image src="/facebook.svg" alt="Facebook" width={20} height={20} className="mr-2" />
            Continue with Facebook
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-xs text-center text-secondary/60 dark:text-tertiary/60">
            By continuing, you agree to our{" "}
            <Button
              variant="link"
              className="h-auto p-0 text-primary hover:text-primary/80 text-xs transition-colors duration-200"
              onClick={() => window.open("/privacy", "_blank")}
            >
              Privacy Policy
            </Button>{" "}
            and{" "}
            <Button
              variant="link"
              className="h-auto p-0 text-primary hover:text-primary/80 text-xs transition-colors duration-200"
              onClick={() => window.open("/terms", "_blank")}
            >
              Terms of Service
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

