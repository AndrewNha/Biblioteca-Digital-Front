"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { PageLoader } from "@/components/loading-spinner"
import { ErrorDisplay } from "@/components/error-display"
import { EmptyState } from "@/components/empty-state"
import { BookCard } from "@/components/books/book-card"
import { BookFormDialog } from "@/components/books/book-form-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { getBooks, deleteBook, getAuthors, ApiError } from "@/lib/api"
import type { Book, Author } from "@/lib/types"

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingBook, setDeletingBook] = useState<Book | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [booksData, authorsData] = await Promise.all([
        getBooks(),
        getAuthors(),
      ])
      setBooks(booksData)
      setAuthors(authorsData)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to load books. Please check if the server is running.")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = () => {
    setEditingBook(null)
    setFormOpen(true)
  }

  const handleEdit = (book: Book) => {
    setEditingBook(book)
    setFormOpen(true)
  }

  const handleDeleteClick = (book: Book) => {
    setDeletingBook(book)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingBook) return
    try {
      setDeleteLoading(true)
      await deleteBook(deletingBook.id)
      setDeleteConfirmOpen(false)
      setDeletingBook(null)
      fetchData()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to delete book")
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setFormOpen(false)
    setEditingBook(null)
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
        title="Books"
        description="Manage your library book catalog"
      >
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </PageHeader>

      {error && (
        <div className="mt-6">
          <ErrorDisplay message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      <div className="mt-8">
        {books.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No books yet"
            description="Get started by adding your first book to the library."
          >
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={() => handleEdit(book)}
                onDelete={() => handleDeleteClick(book)}
              />
            ))}
          </div>
        )}
      </div>

      <BookFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={handleFormSuccess}
        book={editingBook}
        authors={authors}
        onError={setError}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false)
          setDeletingBook(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Book"
        description={`Are you sure you want to delete "${deletingBook?.title}"? This action cannot be undone. Note: Books with active loans, pending reservations, or associated authors cannot be deleted.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteLoading}
      />
    </div>
  )
}
