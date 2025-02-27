"use client"

import { useState, useEffect } from "react"
import WelcomeScreen from "@/components/welcome-screen"
import LoginForm from "@/components/login-form"
import ChatInterface from "@/components/chat-interface"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Wait until mounted to avoid hydration mismatch with theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGetStarted = () => {
    setShowWelcome(false)
    setShowLogin(true)
  }

  const handleLogin = (email: string, password: string) => {
    // In a real app, you would validate credentials here
    setShowLogin(false)
    setIsLoggedIn(true)
  }

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {showWelcome && <WelcomeScreen onGetStarted={handleGetStarted} />}
      {showLogin && <LoginForm onLogin={handleLogin} />}
      {isLoggedIn && <ChatInterface />}
    </ThemeProvider>
  )
}

