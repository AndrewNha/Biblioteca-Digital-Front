export interface Author {
  id: number
  name: string
  nationality?: string
  birthDate?: string
}

export interface Book {
  id: number
  title: string
  isbn?: string
  publicationYear?: number
  availableCopies?: number
  totalCopies?: number
  authors: Author[]
}

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  registrationDate?: string
}

export type LoanStatus = "ACTIVE" | "RETURNED" | "LATE"

export interface Loan {
  id: number
  user: User
  book: Book
  loanDate: string
  dueDate: string
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
