"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createLoan, updateLoan, ApiError } from "@/lib/api"
import type { Loan, Book, User } from "@/lib/types"

interface LoanFormDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  loan: Loan | null
  books: Book[]
  users: User[]
  onError: (error: string) => void
}

export function LoanFormDialog({
  open,
  onClose,
  onSuccess,
  loan,
  books,
  users,
  onError,
}: LoanFormDialogProps) {
  const [userId, setUserId] = useState<string>("")
  const [bookId, setBookId] = useState<string>("")
  const [dueDate, setDueDate] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const isReturned = loan?.status === "RETURNED"

  useEffect(() => {
    if (open) {
      if (loan) {
        setUserId(loan.user?.id?.toString() || "")
        setBookId(loan.book?.id?.toString() || "")
        setDueDate(loan.dueDate || "")
      } else {
        setUserId("")
        setBookId("")
        // Default due date: 14 days from now
        const defaultDue = new Date()
        defaultDue.setDate(defaultDue.getDate() + 14)
        setDueDate(defaultDue.toISOString().split("T")[0])
      }
      setValidationError(null)
    }
  }, [open, loan])

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

    if (!userId) {
      setValidationError("Please select a user")
      return
    }

    if (!bookId) {
      setValidationError("Please select a book")
      return
    }

    // If loan is returned, book cannot be changed
    if (isReturned && loan && bookId !== loan.book?.id?.toString()) {
      setValidationError("Cannot change the book on a returned loan")
      return
    }

    const data = {
      user: { id: parseInt(userId) },
      book: { id: parseInt(bookId) },
      dueDate: dueDate || undefined,
    }

    try {
      setLoading(true)
      if (loan) {
        await updateLoan(loan.id, data)
      } else {
        await createLoan(data)
      }
      onSuccess()
    } catch (err) {
      if (err instanceof ApiError) {
        onError(err.message)
      } else {
        onError("An error occurred while saving the loan")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  // Filter books that have available copies for new loans
  const availableBooks = loan 
    ? books 
    : books.filter((b) => (b.availableCopies ?? 0) > 0)

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
        aria-labelledby="loan-form-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 id="loan-form-title" className="text-lg font-medium">
            {loan ? "Edit Loan" : "Create New Loan"}
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

          {isReturned && (
            <div className="p-3 text-sm text-muted-foreground bg-muted rounded-lg">
              This loan has been returned. Book cannot be changed.
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="user" className="text-sm font-medium">
              User <span className="text-destructive">*</span>
            </label>
            <select
              id="user"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Note: Users can have max 3 active loans
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="book" className="text-sm font-medium">
              Book <span className="text-destructive">*</span>
            </label>
            <select
              id="book"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
              disabled={isReturned}
            >
              <option value="">Select a book</option>
              {availableBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} {book.availableCopies !== undefined && `(${book.availableCopies} available)`}
                </option>
              ))}
            </select>
            {!loan && availableBooks.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No books with available copies. Consider making a reservation instead.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : loan ? "Save Changes" : "Create Loan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
