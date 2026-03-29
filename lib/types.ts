export interface Author {
  id: number
  name: string
  nationality?: string
  booksWritten?: Book[]
}

export interface Book {
  id: number
  name: string
  genre?: string
  publisher?: string
  releaseDate?: string
  quantity?: number
  quantityAvailable?: number
  authors: Author[]
}

export interface User {
  id: number
  name: string
  email: string
  telephoneNumber?: string
}

export type LoanStatus = "ACTIVE" | "RETURNED" | "LATE"

export interface Loan {
  id: number
  user: User
  book: Book
  loanDate: string
  returnDate?: string
  status: LoanStatus
}

export type ReservationStatus = "PENDING" | "COMPLETED" | "CANCELLED"

export interface Reservation {
  id: number
  user: User
  book: Book
  reservationDate: string
  status: ReservationStatus
}

export interface ApiError {
  message: string
  status?: number
}
