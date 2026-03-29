"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { PageLoader } from "@/components/loading-spinner"
import { ErrorDisplay } from "@/components/error-display"
import { EmptyState } from "@/components/empty-state"
import { AuthorCard } from "@/components/authors/author-card"
import { AuthorFormDialog } from "@/components/authors/author-form-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { getAuthors, deleteAuthor, ApiError } from "@/lib/api"
import type { Author } from "@/lib/types"

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingAuthor, setDeletingAuthor] = useState<Author | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAuthors()
      setAuthors(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to load authors. Please check if the server is running.")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = () => {
    setEditingAuthor(null)
    setFormOpen(true)
  }

  const handleEdit = (author: Author) => {
    setEditingAuthor(author)
    setFormOpen(true)
  }

  const handleDeleteClick = (author: Author) => {
    setDeletingAuthor(author)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingAuthor) return
    try {
      setDeleteLoading(true)
      await deleteAuthor(deletingAuthor.id)
      setDeleteConfirmOpen(false)
      setDeletingAuthor(null)
      fetchData()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to delete author")
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setFormOpen(false)
    setEditingAuthor(null)
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
        title="Authors"
        description="Manage authors and their information"
      >
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Author
        </Button>
      </PageHeader>

      {error && (
        <div className="mt-6">
          <ErrorDisplay message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      <div className="mt-8">
        {authors.length === 0 ? (
          <EmptyState
            icon={UserCircle}
            title="No authors yet"
            description="Get started by adding your first author."
          >
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Author
            </Button>
          </EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {authors.map((author) => (
              <AuthorCard
                key={author.id}
                author={author}
                onEdit={() => handleEdit(author)}
                onDelete={() => handleDeleteClick(author)}
              />
            ))}
          </div>
        )}
      </div>

      <AuthorFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={handleFormSuccess}
        author={editingAuthor}
        onError={setError}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false)
          setDeletingAuthor(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Author"
        description={`Are you sure you want to delete "${deletingAuthor?.name}"? This action cannot be undone. Note: Authors with associated books cannot be deleted. Remove the author from all books first via book editing.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteLoading}
      />
    </div>
  )
}
