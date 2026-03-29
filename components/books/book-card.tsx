import { Pencil, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Book } from "@/lib/types"

interface BookCardProps {
  book: Book
  onEdit: () => void
  onDelete: () => void
}

export function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <div className="flex flex-col p-5 bg-card border border-border rounded-lg">
      <div className="flex-1">
        <h3 className="font-medium text-foreground line-clamp-2">{book.name}</h3>
        
        {book.authors && book.authors.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span className="line-clamp-1">
              {book.authors.map((a) => a.name).join(", ")}
            </span>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {book.genre && (
            <span className="px-2 py-1 bg-muted rounded">
              {book.genre}
            </span>
          )}
          {book.publisher && (
            <span className="px-2 py-1 bg-muted rounded">
              {book.publisher}
            </span>
          )}
          {book.releaseDate && (
            <span className="px-2 py-1 bg-muted rounded">
              {book.releaseDate}
            </span>
          )}
          {(book.quantityAvailable !== undefined && book.quantity !== undefined) && (
            <span className="px-2 py-1 bg-muted rounded">
              {book.quantityAvailable}/{book.quantity} available
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
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
          className="flex-1 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
          Delete
        </Button>
      </div>
    </div>
  )
}
