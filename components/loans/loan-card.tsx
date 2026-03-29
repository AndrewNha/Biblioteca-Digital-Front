import { Pencil, Trash2, RotateCcw, BookOpen, User, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Loan } from "@/lib/types"

interface LoanCardProps {
  loan: Loan
  onEdit: () => void
  onDelete: () => void
  onReturn: () => void
}

export function LoanCard({ loan, onEdit, onDelete, onReturn }: LoanCardProps) {
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
      case "ACTIVE":
        return (
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-muted text-foreground">
            Active
          </span>
        )
      case "RETURNED":
        return (
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-muted text-muted-foreground">
            Returned
          </span>
        )
      case "LATE":
        return (
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-destructive/20 text-destructive">
            Late
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

  const isReturned = loan.status === "RETURNED"

  return (
    <div className="flex flex-col p-5 bg-card border border-border rounded-lg">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-foreground line-clamp-2 flex-1">
            {loan.book?.title || "Unknown Book"}
          </h3>
          {getStatusBadge(loan.status)}
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span>{loan.user?.name || "Unknown User"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Loaned: {formatDate(loan.loanDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Due: {formatDate(loan.dueDate)}</span>
          </div>
          {loan.returnDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Returned: {formatDate(loan.returnDate)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
        {!isReturned && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onReturn}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Return
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
          className={isReturned ? "flex-1" : ""}
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  )
}
