import { Pencil, Trash2, Globe, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Author } from "@/lib/types"

interface AuthorCardProps {
  author: Author
  onEdit: () => void
  onDelete: () => void
}

export function AuthorCard({ author, onEdit, onDelete }: AuthorCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="flex flex-col p-5 bg-card border border-border rounded-lg">
      <div className="flex-1">
        <h3 className="font-medium text-foreground">{author.name}</h3>

        <div className="mt-3 space-y-2">
          {author.nationality && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              <span>{author.nationality}</span>
            </div>
          )}
          {author.birthDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(author.birthDate)}</span>
            </div>
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
