"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, ClipboardList, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { PageLoader } from "@/components/loading-spinner"
import { ErrorDisplay } from "@/components/error-display"
import { EmptyState } from "@/components/empty-state"
import { LoanCard } from "@/components/loans/loan-card"
import { LoanFormDialog } from "@/components/loans/loan-form-dialog"
import { LoanStatsDialog } from "@/components/loans/loan-stats-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import {
  getLoans,
  deleteLoan,
  returnLoan,
  getBooks,
  getUsers,
  ApiError,
} from "@/lib/api"
import type { Loan, Book, User } from "@/lib/types"

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingLoan, setDeletingLoan] = useState<Loan | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [returnConfirmOpen, setReturnConfirmOpen] = useState(false)
  const [returningLoan, setReturningLoan] = useState<Loan | null>(null)
  const [returnLoading, setReturnLoading] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [loansData, booksData, usersData] = await Promise.all([
        getLoans(),
        getBooks(),
        getUsers(),
      ])
      setLoans(loansData)
      setBooks(booksData)
      setUsers(usersData)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to load loans. Please check if the server is running.")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = () => {
    setEditingLoan(null)
    setFormOpen(true)
  }

  const handleEdit = (loan: Loan) => {
    setEditingLoan(loan)
    setFormOpen(true)
  }

  const handleDeleteClick = (loan: Loan) => {
    setDeletingLoan(loan)
    setDeleteConfirmOpen(true)
  }

  const handleReturnClick = (loan: Loan) => {
    if (loan.status === "RETURNED") {
      setError("This loan has already been returned.")
      return
    }
    setReturningLoan(loan)
    setReturnConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingLoan) return
    try {
      setDeleteLoading(true)
      await deleteLoan(deletingLoan.id)
      setDeleteConfirmOpen(false)
      setDeletingLoan(null)
      fetchData()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to delete loan")
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleReturnConfirm = async () => {
    if (!returningLoan) return
    try {
      setReturnLoading(true)
      await returnLoan(returningLoan.id)
      setReturnConfirmOpen(false)
      setReturningLoan(null)
      fetchData()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to return loan")
      }
    } finally {
      setReturnLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setFormOpen(false)
    setEditingLoan(null)
    fetchData()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <PageLoader />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <PageHeader
        title="Loans"
        description="Manage book loans and returns"
      >
        <Button variant="outline" onClick={() => setStatsOpen(true)}>
          <TrendingUp className="h-4 w-4 mr-2" />
          Stats
        </Button>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Loan
        </Button>
      </PageHeader>

      {error && (
        <div className="mt-6">
          <ErrorDisplay message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      <div className="mt-8">
        {loans.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No loans yet"
            description="Get started by creating your first loan."
          >
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              New Loan
            </Button>
          </EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onEdit={() => handleEdit(loan)}
                onDelete={() => handleDeleteClick(loan)}
                onReturn={() => handleReturnClick(loan)}
              />
            ))}
          </div>
        )}
      </div>

      <LoanFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={handleFormSuccess}
        loan={editingLoan}
        books={books}
        users={users}
        onError={setError}
      />

      <LoanStatsDialog
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false)
          setDeletingLoan(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Loan"
        description={`Are you sure you want to delete this loan for "${deletingLoan?.book?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteLoading}
      />

      <ConfirmDialog
        open={returnConfirmOpen}
        onClose={() => {
          setReturnConfirmOpen(false)
          setReturningLoan(null)
        }}
        onConfirm={handleReturnConfirm}
        title="Return Book"
        description={`Mark "${returningLoan?.book?.title}" as returned?`}
        confirmLabel="Return"
        loading={returnLoading}
      />
    </div>
  )
}
