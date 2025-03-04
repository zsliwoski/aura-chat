"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Check } from "lucide-react"

interface SettingsDialogProps {
  fullname: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ fullname, open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(false)
  const [language, setLanguage] = useState("english")
  const [name, setName] = useState(fullname)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-light-bg dark:bg-dark-bg text-secondary dark:text-tertiary">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-tertiary bg-light-bg text-secondary focus:border-primary focus:ring-primary/20 dark:border-secondary/30 dark:bg-dark-bg dark:text-tertiary"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Theme Preferences</h3>
            <RadioGroup defaultValue={theme} onValueChange={(value) => setTheme(value as "light" | "dark")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">Dark</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Language - Coming soon!</h3>
            <Select disabled value={language} onValueChange={setLanguage}>
              <SelectTrigger title="Coming Soon!" className="w-full border-tertiary bg-light-bg text-secondary focus:border-primary focus:ring-primary/20 dark:border-secondary/30 dark:bg-dark-bg dark:text-tertiary">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-light-bg dark:bg-dark-bg border-tertiary dark:border-secondary/30">
                <SelectItem value="english" className="text-secondary dark:text-tertiary hover:bg-primary/10">
                  English
                </SelectItem>
                <SelectItem value="spanish" className="text-secondary dark:text-tertiary hover:bg-primary/10">
                  Spanish
                </SelectItem>
                <SelectItem value="french" className="text-secondary dark:text-tertiary hover:bg-primary/10">
                  French
                </SelectItem>
                <SelectItem value="german" className="text-secondary dark:text-tertiary hover:bg-primary/10">
                  German
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Notifications - Coming soon!</h3>
            <div title="Coming Soon!" className="flex items-center space-x-2">
              <Switch disabled id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              <Label htmlFor="notifications">Enable notifications</Label>
            </div>
          </div>



          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105"
          >
            <Check className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

