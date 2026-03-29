"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createUser, updateUser, ApiError } from "@/lib/api"
import type { User } from "@/lib/types"

interface UserFormDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  user: User | null
  onError: (error: string) => void
}

export function UserFormDialog({
  open,
  onClose,
  onSuccess,
  user,
  onError,
}: UserFormDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      if (user) {
        setName(user.name)
        setEmail(user.email)
        setPhone(user.phone || "")
      } else {
        setName("")
        setEmail("")
        setPhone("")
      }
      setValidationError(null)
      setTimeout(() => nameInputRef.current?.focus(), 100)
    }
  }, [open, user])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    if (!name.trim()) {
      setValidationError("Name is required")
      return
    }

    if (!email.trim()) {
      setValidationError("Email is required")
      return
    }

    if (!validateEmail(email.trim())) {
      setValidationError("Please enter a valid email address")
      return
    }

    const data = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
    }

    try {
      setLoading(true)
      if (user) {
        await updateUser(user.id, data)
      } else {
        await createUser(data)
      }
      onSuccess()
    } catch (err) {
      if (err instanceof ApiError) {
        onError(err.message)
      } else {
        onError("An error occurred while saving the user")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-50 w-full max-w-md mx-4 bg-card border border-border rounded-lg shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 id="user-form-title" className="text-lg font-medium">
            {user ? "Edit User" : "Add New User"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {validationError && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
              {validationError}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              ref={nameInputRef}
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter user name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., +1 234 567 8900"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : user ? "Save Changes" : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
