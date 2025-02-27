import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface WelcomeScreenProps {
  onGetStarted: () => void
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-tertiary/30 to-tertiary/10 px-4 text-center dark:from-dark-bg dark:to-dark-bg/95 transition-colors duration-300">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-primary/10 p-4 animate-pulse-scale">
            <MessageSquare className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-secondary dark:text-tertiary sm:text-5xl animate-slide-down">
          Welcome to AuraChat
        </h1>
        <p className="mb-8 text-xl text-secondary/80 dark:text-tertiary/80 animate-slide-up">
          Experience the power of AI conversation. Ask questions, get creative responses, and explore new ideas with our
          advanced AI assistant.
        </p>
        <div className="space-y-4">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/20"
          >
            Get Started
          </Button>
          <p className="text-sm text-secondary/60 dark:text-tertiary/60">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 animate-slide-up">
        <div className="rounded-lg bg-light-bg p-6 shadow-lg dark:bg-dark-bg dark:shadow-dark-bg/50 transition-transform duration-300 hover:translate-y-[-5px]">
          <h3 className="mb-2 text-lg font-medium text-secondary dark:text-tertiary">Ask Anything</h3>
          <p className="text-secondary/70 dark:text-tertiary/70">
            Get answers to your questions on any topic, from science to creative writing.
          </p>
        </div>
        <div className="rounded-lg bg-light-bg p-6 shadow-lg dark:bg-dark-bg dark:shadow-dark-bg/50 transition-transform duration-300 hover:translate-y-[-5px]">
          <h3 className="mb-2 text-lg font-medium text-secondary dark:text-tertiary">Smart Conversations</h3>
          <p className="text-secondary/70 dark:text-tertiary/70">
            Enjoy natural, flowing conversations with context-aware responses.
          </p>
        </div>
        <div className="rounded-lg bg-light-bg p-6 shadow-lg dark:bg-dark-bg dark:shadow-dark-bg/50 transition-transform duration-300 hover:translate-y-[-5px]">
          <h3 className="mb-2 text-lg font-medium text-secondary dark:text-tertiary">Private & Secure</h3>
          <p className="text-secondary/70 dark:text-tertiary/70">
            Your conversations are private and your data is handled securely.
          </p>
        </div>
      </div>
    </div>
  )
}

