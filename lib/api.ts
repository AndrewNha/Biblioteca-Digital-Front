const API_BASE_URL = "http://localhost:8080"

export class ApiError extends Error {
  status: number
  
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = "ApiError"
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = "An error occurred"
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorData.error || JSON.stringify(errorData)
    } catch {
      errorMessage = response.statusText || `Error ${response.status}`
    }
    throw new ApiError(errorMessage, response.status)
  }
  
  // Handle empty responses (like DELETE)
  const text = await response.text()
  if (!text) return {} as T
  
  return JSON.parse(text) as T
}

// Books
export async function getBooks() {
  const response = await fetch(`${API_BASE_URL}/book`)
  return handleResponse<import("./types").Book[]>(response)
}

export async function getBook(id: number) {
  const response = await fetch(`${API_BASE_URL}/book/${id}`)
  return handleResponse<import("./types").Book>(response)
}

export async function createBook(data: { title: string; isbn?: string; publicationYear?: number; totalCopies?: number; authors: { id: number }[] }) {
  const response = await fetch(`${API_BASE_URL}/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<import("./types").Book>(response)
}

export async function updateBook(id: number, data: { title: string; isbn?: string; publicationYear?: number; totalCopies?: number; authors: { id: number }[] }) {
  const response = await fetch(`${API_BASE_URL}/book/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<import("./types").Book>(response)
}

export async function deleteBook(id: number) {
  const response = await fetch(`${API_BASE_URL}/book/${id}`, {
    method: "DELETE",
  })
  return handleResponse<void>(response)
}

// Authors
export async function getAuthors() {
  const response = await fetch(`${API_BASE_URL}/author`)
  return handleResponse<import("./types").Author[]>(response)
}

export async function getAuthor(id: number) {
  const response = await fetch(`${API_BASE_URL}/author/${id}`)
  return handleResponse<import("./types").Author>(response)
}

export async function createAuthor(data: { name: string; nationality?: string; birthDate?: string }) {
  const response = await fetch(`${API_BASE_URL}/author`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<import("./types").Author>(response)
}

export async function updateAuthor(id: number, data: { name: string; nationality?: string; birthDate?: string }) {
  const response = await fetch(`${API_BASE_URL}/author/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<import("./types").Author>(response)
}

export async function deleteAuthor(id: number) {
  const response = await fetch(`${API_BASE_URL}/author/${id}`, {
    method: "DELETE",
  })
  return handleResponse<void>(response)
}

// Users
export async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/user`)
  return handleResponse<import("./types").User[]>(response)
}

export async function getUser(id: number) {
  const response = await fetch(`${API_BASE_URL}/user/${id}`)
  return handleResponse<import("./types").User>(response)
}

export async function createUser(data: { name: string; email: string; phone?: string }) {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<import("./types").User>(response)
}

export async function updateUser(id: number, data: { name: string; email: string; phone?: string }) {
  const response = await fetch(`${API_BASE_URL}/user/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<import("./types").User>(response)
}

export async function deleteUser(id: number) {
  const response = await fetch(`${API_BASE_URL}/user/${id}`, {
    method: "DELETE",
  })
  return handleResponse<void>(response)
}

// Loans
export async function getLoans() {
  const response = await fetch(`${API_BASE_URL}/loan`)
  return handleResponse<import("./types").Loan[]>(response)
}

export async function getLoan(id: number) {
  const response = await fetch(`${API_BASE_URL}/loan/${id}`)
  return handleResponse<import("./types").Loan>(response)
}

export async function createLoan(data: { user: { id: number }; book: { id: number }; dueDate?: string }) {
  const response = await fetch(`${API_BASE_URL}/loan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<import("./types").Loan>(response)
}

export async function updateLoan(id: number, data: { user: { id: number }; book: { id: number }; dueDate?: string }) {
  const response = await fetch(`${API_BASE_URL}/loan/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<import("./types").Loan>(response)
}

export async function returnLoan(id: number) {
  const response = await fetch(`${API_BASE_URL}/loan/${id}/return`, {
    method: "PATCH",
  })
  return handleResponse<import("./types").Loan>(response)
}

export async function deleteLoan(id: number) {
  const response = await fetch(`${API_BASE_URL}/loan/${id}`, {
    method: "DELETE",
  })
  return handleResponse<void>(response)
}

export async function getMostBorrowedBook() {
  const response = await fetch(`${API_BASE_URL}/loan/most-borrowed-book`)
  return handleResponse<import("./types").Book>(response)
}

export async function getMostActiveUser() {
  const response = await fetch(`${API_BASE_URL}/loan/most-active-user`)
  return handleResponse<import("./types").User>(response)
}

// Reservations
export async function getReservations() {
  const response = await fetch(`${API_BASE_URL}/reservation`)
  return handleResponse<import("./types").Reservation[]>(response)
}

export async function getReservation(id: number) {
  const response = await fetch(`${API_BASE_URL}/reservation/${id}`)
  return handleResponse<import("./types").Reservation>(response)
}

export async function createReservation(data: { user: { id: number }; book: { id: number } }) {
  const response = await fetch(`${API_BASE_URL}/reservation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<import("./types").Reservation>(response)
}

export async function updateReservation(id: number, data: { user: { id: number }; book: { id: number } }) {
  const response = await fetch(`${API_BASE_URL}/reservation/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<import("./types").Reservation>(response)
}

export async function cancelReservation(id: number) {
  const response = await fetch(`${API_BASE_URL}/reservation/${id}/cancel`, {
    method: "PATCH",
  })
  return handleResponse<import("./types").Reservation>(response)
}

export async function deleteReservation(id: number) {
  const response = await fetch(`${API_BASE_URL}/reservation/${id}`, {
    method: "DELETE",
  })
  return handleResponse<void>(response)
}
