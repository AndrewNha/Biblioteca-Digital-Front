"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, CalendarClock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { PageLoader } from "@/components/loading-spinner"
import { ErrorDisplay } from "@/components/error-display"
import { EmptyState } from "@/components/empty-state"
import { ReservationCard } from "@/components/reservations/reservation-card"
import { ReservationFormDialog } from "@/components/reservations/reservation-form-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import {
  getReservations,
  deleteReservation,
  cancelReservation,
  getBooks,
  getUsers,
  ApiError,
} from "@/lib/api"
import type { Reservation, Book, User } from "@/lib/types"

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingReservation, setDeletingReservation] = useState<Reservation | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false)
  const [cancellingReservation, setCancellingReservation] = useState<Reservation | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [reservationsData, booksData, usersData] = await Promise.all([
        getReservations(),
        getBooks(),
        getUsers(),
      ])
      setReservations(reservationsData)
      setBooks(booksData)
      setUsers(usersData)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to load reservations. Please check if the server is running.")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = () => {
    setEditingReservation(null)
    setFormOpen(true)
  }

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation)
    setFormOpen(true)
  }

  const handleDeleteClick = (reservation: Reservation) => {
    setDeletingReservation(reservation)
    setDeleteConfirmOpen(true)
  }

  const handleCancelClick = (reservation: Reservation) => {
    if (reservation.status === "COMPLETED" || reservation.status === "CANCELLED") {
      setError(`Cannot cancel a reservation that is already ${reservation.status.toLowerCase()}.`)
      return
    }
    setCancellingReservation(reservation)
    setCancelConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingReservation) return
    try {
      setDeleteLoading(true)
      await deleteReservation(deletingReservation.id)
      setDeleteConfirmOpen(false)
      setDeletingReservation(null)
      fetchData()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to delete reservation")
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCancelConfirm = async () => {
    if (!cancellingReservation) return
    try {
      setCancelLoading(true)
      await cancelReservation(cancellingReservation.id)
      setCancelConfirmOpen(false)
      setCancellingReservation(null)
      fetchData()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to cancel reservation")
      }
    } finally {
      setCancelLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setFormOpen(false)
    setEditingReservation(null)
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
        title="Reservations"
        description="Manage book reservations"
      >
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Reservation
        </Button>
      </PageHeader>

      {error && (
        <div className="mt-6">
          <ErrorDisplay message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      <div className="mt-8">
        {reservations.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No reservations yet"
            description="Reservations can be made when books have no available copies."
          >
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              New Reservation
            </Button>
          </EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onEdit={() => handleEdit(reservation)}
                onDelete={() => handleDeleteClick(reservation)}
                onCancel={() => handleCancelClick(reservation)}
              />
            ))}
          </div>
        )}
      </div>

      <ReservationFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={handleFormSuccess}
        reservation={editingReservation}
        books={books}
        users={users}
        onError={setError}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false)
          setDeletingReservation(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Reservation"
        description={`Are you sure you want to delete this reservation for "${deletingReservation?.book?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteLoading}
      />

      <ConfirmDialog
        open={cancelConfirmOpen}
        onClose={() => {
          setCancelConfirmOpen(false)
          setCancellingReservation(null)
        }}
        onConfirm={handleCancelConfirm}
        title="Cancel Reservation"
        description={`Cancel the reservation for "${cancellingReservation?.book?.title}"?`}
        confirmLabel="Cancel Reservation"
        loading={cancelLoading}
      />
    </div>
  )
}
