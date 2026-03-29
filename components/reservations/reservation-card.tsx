import { Pencil, Trash2, XCircle, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Reservation } from "@/lib/types"

interface ReservationCardProps {
  reservation: Reservation
  onEdit: () => void
  onDelete: () => void
  onCancel: () => void
}

export function ReservationCard({ reservation, onEdit, onDelete, onCancel }: ReservationCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-muted text-foreground">
            Pending
          </span>
        )
      case "COMPLETED":
        return (
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-muted text-muted-foreground">
            Completed
          </span>
        )
      case "CANCELLED":
        return (
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-destructive/20 text-destructive">
            Cancelled
          </span>
        )
      default:
        return (
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-muted text-muted-foreground">
            {status}
          </span>
        )
    }
  }

  const canCancel = reservation.status === "PENDING"

  return (
    <div className="flex flex-col p-5 bg-card border border-border rounded-lg">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-foreground line-clamp-2 flex-1">
            {reservation.book?.title || "Unknown Book"}
          </h3>
          {getStatusBadge(reservation.status)}
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span>{reservation.user?.name || "Unknown User"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Reserved: {formatDate(reservation.reservationDate)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
        {canCancel && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onCancel}
          >
            <XCircle className="h-3.5 w-3.5 mr-1.5" />
            Cancel
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onEdit}
        >
          <Pencil className="h-3.5 w-3.5 mr-1.5" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={canCancel ? "" : "flex-1"}
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  )
}
