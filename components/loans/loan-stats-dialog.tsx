"use client"

import { useState, useEffect } from "react"
import { X, BookOpen, User, Trophy } from "lucide-react"
import { getMostBorrowedBook, getMostActiveUser, ApiError } from "@/lib/api"
import type { Book, User as UserType } from "@/lib/types"
import { LoadingSpinner } from "@/components/loading-spinner"

interface LoanStatsDialogProps {
  open: boolean
  onClose: () => void
}

export function LoanStatsDialog({ open, onClose }: LoanStatsDialogProps) {
  const [mostBorrowedBook, setMostBorrowedBook] = useState<Book | null>(null)
  const [mostActiveUser, setMostActiveUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      const fetchStats = async () => {
        setLoading(true)
        setError(null)
        try {
          const [bookData, userData] = await Promise.allSettled([
            getMostBorrowedBook(),
            getMostActiveUser(),
          ])

          if (bookData.status === "fulfilled") {
            setMostBorrowedBook(bookData.value)
          }
          if (userData.status === "fulfilled") {
            setMostActiveUser(userData.value)
          }
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message)
          } else {
            setError("Failed to load statistics")
          }
        } finally {
          setLoading(false)
        }
      }
      fetchStats()
    }
  }, [open])

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
        aria-labelledby="stats-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 id="stats-title" className="text-lg font-medium flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Loan Statistics
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <p className="text-sm text-destructive text-center py-4">{error}</p>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Most Borrowed Book</span>
                </div>
                {mostBorrowedBook ? (
                  <div>
                    <p className="font-medium text-foreground">{mostBorrowedBook.name}</p>
                    {mostBorrowedBook.authors && mostBorrowedBook.authors.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        by {mostBorrowedBook.authors.map((a) => a.name).join(", ")}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No data available</p>
                )}
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <User className="h-4 w-4" />
                  <span>Most Active User</span>
                </div>
                {mostActiveUser ? (
                  <div>
                    <p className="font-medium text-foreground">{mostActiveUser.name}</p>
                    <p className="text-sm text-muted-foreground">{mostActiveUser.email}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No data available</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
