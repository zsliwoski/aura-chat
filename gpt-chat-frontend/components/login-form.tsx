"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface LoginFormProps {
  onLogin: (email: string, password: string) => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isHovering, setIsHovering] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(email, password)
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
                className={`h-8 w-8 text-primary transition-transform duration-300 ${isHovering ? "scale-110 rotate-12" : ""}`}
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-secondary dark:text-tertiary">Welcome back</CardTitle>
          <CardDescription className="text-secondary/70 dark:text-tertiary/70">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-secondary dark:text-tertiary">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-tertiary bg-light-bg text-secondary focus:border-primary focus:ring-primary/20 dark:border-secondary/30 dark:bg-dark-bg dark:text-tertiary transition-all duration-200 focus:scale-[1.01]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-secondary dark:text-tertiary">
                  Password
                </Label>
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-tertiary bg-light-bg text-secondary focus:border-primary focus:ring-primary/20 dark:border-secondary/30 dark:bg-dark-bg dark:text-tertiary transition-all duration-200 focus:scale-[1.01]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-primary/20"
            >
              Sign in
            </Button>
            <div className="text-center text-sm text-secondary/70 dark:text-tertiary/70">
              Don&apos;t have an account?{" "}
              <Button
                variant="link"
                className="h-auto p-0 text-primary hover:text-primary/80 transition-colors duration-200"
              >
                Sign up
              </Button>
            </div>
            <div className="mt-4 text-xs text-center text-secondary/60 dark:text-tertiary/60">
              By signing in, you agree to our{" "}
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
        </form>
      </Card>
    </div>
  )
}

