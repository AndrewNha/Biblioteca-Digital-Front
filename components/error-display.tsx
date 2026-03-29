import { AlertCircle, X } from "lucide-react"

interface ErrorDisplayProps {
  message: string
  onDismiss?: () => void
}

export function ErrorDisplay({ message, onDismiss }: ErrorDisplayProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
      <p className="flex-1 text-sm text-destructive">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 p-1 rounded hover:bg-destructive/20 transition-colors duration-200"
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4 text-destructive" />
        </button>
      )}
    </div>
  )
}
