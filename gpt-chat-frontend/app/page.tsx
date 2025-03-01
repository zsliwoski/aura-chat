"use client"

import { useState, useEffect } from "react"
import WelcomeScreen from "@/components/welcome-screen"
import LoginForm from "@/components/login-form"
import ChatInterface from "@/components/chat-interface"
import { ThemeProvider } from "@/components/theme-provider"
import { useSession } from "next-auth/react"

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { status } = useSession()

  // Wait until mounted to avoid hydration mismatch with theme
  useEffect(() => {
    setMounted(true)
    if (status === "authenticated") {
      setShowWelcome(false)
      setShowLogin(false)
      setIsLoggedIn(true)
    }
  }, [])

  const handleGetStarted = () => {
    setShowWelcome(false)
    setShowLogin(true)
  }



  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {showWelcome && <WelcomeScreen onGetStarted={handleGetStarted} />}
      {showLogin && <LoginForm />}
      {isLoggedIn && <ChatInterface />}
    </ThemeProvider>
  )
}

