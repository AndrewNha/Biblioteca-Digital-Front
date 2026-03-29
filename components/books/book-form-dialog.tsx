"use client"

import { useState, useEffect, useRef } from "react"
import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createBook, updateBook, ApiError } from "@/lib/api"
import type { Book, Author } from "@/lib/types"

interface BookFormDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  book: Book | null
  authors: Author[]
  onError: (error: string) => void
}

export function BookFormDialog({
  open,
  onClose,
  onSuccess,
  book,
  authors,
  onError,
}: BookFormDialogProps) {
  const [name, setName] = useState("")
  const [genre, setGenre] = useState("")
  const [publisher, setPublisher] = useState("")
  const [releaseDate, setReleaseDate] = useState("")
  const [quantity, setQuantity] = useState("")
  const [quantityAvailable, setQuantityAvailable] = useState("")
  const [selectedAuthors, setSelectedAuthors] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      if (book) {
        setName(book.name)
        setGenre(book.genre || "")
        setPublisher(book.publisher || "")
        setReleaseDate(book.releaseDate || "")
        setQuantity(book.quantity?.toString() || "")
        setQuantityAvailable(book.quantityAvailable?.toString() || "")
        setSelectedAuthors(book.authors?.map((a) => a.id) || [])
      } else {
        setName("")
        setGenre("")
        setPublisher("")
        setReleaseDate("")
        setQuantity("")
        setQuantityAvailable("")
        setSelectedAuthors([])
      }
      setValidationError(null)
      setTimeout(() => nameInputRef.current?.focus(), 100)
    }
  }, [open, book])

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

  const toggleAuthor = (authorId: number) => {
    setSelectedAuthors((prev) =>
      prev.includes(authorId)
        ? prev.filter((id) => id !== authorId)
        : [...prev, authorId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    if (!name.trim()) {
      setValidationError("Name is required")
      return
    }

    const data = {
      name: name.trim(),
      genre: genre.trim() || undefined,
      publisher: publisher.trim() || undefined,
      releaseDate: releaseDate || undefined,
      quantity: quantity ? parseInt(quantity) : undefined,
      quantityAvailable: quantityAvailable ? parseInt(quantityAvailable) : undefined,
      authors: selectedAuthors.map((id) => ({ id })),
    }

    try {
      setLoading(true)
      if (book) {
        await updateBook(book.id, data)
      } else {
        await createBook(data)
      }
      onSuccess()
    } catch (err) {
      if (err instanceof ApiError) {
        onError(err.message)
      } else {
        onError("An error occurred while saving the book")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-50 w-full max-w-lg mx-4 max-h-[90vh] overflow-auto bg-card border border-border rounded-lg shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-form-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 id="book-form-title" className="text-lg font-medium">
            {book ? "Edit Book" : "Add New Book"}
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

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              ref={nameInputRef}
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter book name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="genre" className="text-sm font-medium">
                Genre
              </label>
              <Input
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g., Fiction"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="publisher" className="text-sm font-medium">
                Publisher
              </label>
              <Input
                id="publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="e.g., Penguin"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="releaseDate" className="text-sm font-medium">
              Release Date
            </label>
            <Input
              id="releaseDate"
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantity (Total)
              </label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 5"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="quantityAvailable" className="text-sm font-medium">
                Quantity Available
              </label>
              <Input
                id="quantityAvailable"
                type="number"
                value={quantityAvailable}
                onChange={(e) => setQuantityAvailable(e.target.value)}
                placeholder="e.g., 3"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Authors</label>
            {authors.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No authors available. Create an author first.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg max-h-40 overflow-auto">
                {authors.map((author) => {
                  const isSelected = selectedAuthors.includes(author.id)
                  return (
                    <button
                      key={author.id}
                      type="button"
                      onClick={() => toggleAuthor(author.id)}
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors duration-200
                        ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border border-border hover:bg-accent"
                        }
                      `}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                      {author.name}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : book ? "Save Changes" : "Create Book"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
