import { Pencil, Trash2, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"

interface UserCardProps {
  user: User
  onEdit: () => void
  onDelete: () => void
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <div className="flex flex-col p-5 bg-card border border-border rounded-lg">
      <div className="flex-1">
        <h3 className="font-medium text-foreground">{user.name}</h3>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.telephoneNumber && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span>{user.telephoneNumber}</span>
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
