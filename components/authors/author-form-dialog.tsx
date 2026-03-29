"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createAuthor, updateAuthor, ApiError } from "@/lib/api"
import type { Author } from "@/lib/types"

interface AuthorFormDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  author: Author | null
  onError: (error: string) => void
}

export function AuthorFormDialog({
  open,
  onClose,
  onSuccess,
  author,
  onError,
}: AuthorFormDialogProps) {
  const [name, setName] = useState("")
  const [nationality, setNationality] = useState("")
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      if (author) {
        setName(author.name)
        setNationality(author.nationality || "")
      } else {
        setName("")
        setNationality("")
      }
      setValidationError(null)
      setTimeout(() => nameInputRef.current?.focus(), 100)
    }
  }, [open, author])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    if (!name.trim()) {
      setValidationError("Name is required")
      return
    }

    const data = {
      name: name.trim(),
      nationality: nationality.trim() || undefined,
    }

    try {
      setLoading(true)
      if (author) {
        await updateAuthor(author.id, data)
      } else {
        await createAuthor(data)
      }
      onSuccess()
    } catch (err) {
      if (err instanceof ApiError) {
        onError(err.message)
      } else {
        onError("An error occurred while saving the author")
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
        aria-labelledby="author-form-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 id="author-form-title" className="text-lg font-medium">
            {author ? "Edit Author" : "Add New Author"}
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
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="nationality" className="text-sm font-medium">
              Nationality
            </label>
            <Input
              id="nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="e.g., Brazilian"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : author ? "Save Changes" : "Create Author"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
