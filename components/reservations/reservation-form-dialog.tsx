"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createReservation, updateReservation, ApiError } from "@/lib/api"
import type { Reservation, Book, User } from "@/lib/types"

interface ReservationFormDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  reservation: Reservation | null
  books: Book[]
  users: User[]
  onError: (error: string) => void
}

export function ReservationFormDialog({
  open,
  onClose,
  onSuccess,
  reservation,
  books,
  users,
  onError,
}: ReservationFormDialogProps) {
  const [userId, setUserId] = useState<string>("")
  const [bookId, setBookId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      if (reservation) {
        setUserId(reservation.user?.id?.toString() || "")
        setBookId(reservation.book?.id?.toString() || "")
      } else {
        setUserId("")
        setBookId("")
      }
      setValidationError(null)
    }
  }, [open, reservation])

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

    const data = {
      user: { id: parseInt(userId) },
      book: { id: parseInt(bookId) },
    }

    try {
      setLoading(true)
      if (reservation) {
        await updateReservation(reservation.id, data)
      } else {
        await createReservation(data)
      }
      onSuccess()
    } catch (err) {
      if (err instanceof ApiError) {
        onError(err.message)
      } else {
        onError("An error occurred while saving the reservation")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  // For new reservations, only show books without available copies
  const unavailableBooks = reservation
    ? books
    : books.filter((b) => (b.quantityAvailable ?? 0) === 0)

  // Show all books as a fallback if no unavailable books
  const displayBooks = reservation ? books : (unavailableBooks.length > 0 ? unavailableBooks : books)

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
        aria-labelledby="reservation-form-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 id="reservation-form-title" className="text-lg font-medium">
            {reservation ? "Edit Reservation" : "Create New Reservation"}
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

          {!reservation && (
            <div className="p-3 text-sm text-muted-foreground bg-muted rounded-lg">
              Reservations can only be made for books without available copies.
              If a book has copies available, create a loan instead.
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
              Note: Users cannot reserve the same book twice with pending status
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
            >
              <option value="">Select a book</option>
              {displayBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.name} {book.quantityAvailable !== undefined && `(${book.quantityAvailable} available)`}
                </option>
              ))}
            </select>
            {!reservation && unavailableBooks.length === 0 && (
              <p className="text-xs text-muted-foreground">
                All books have available copies. Consider creating a loan instead.
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : reservation ? "Save Changes" : "Create Reservation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
