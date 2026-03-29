import Link from "next/link"
import { BookOpen, Users, UserCircle, ClipboardList, CalendarClock, ArrowRight } from "lucide-react"

const features = [
  {
    title: "Books",
    description: "Manage your library catalog with complete book information and author associations.",
    href: "/books",
    icon: BookOpen,
  },
  {
    title: "Authors",
    description: "Keep track of authors and their nationalities.",
    href: "/authors",
    icon: UserCircle,
  },
  {
    title: "Users",
    description: "Manage library members with contact information and registration details.",
    href: "/users",
    icon: Users,
  },
  {
    title: "Loans",
    description: "Track book loans, returns, and view statistics.",
    href: "/loans",
    icon: ClipboardList,
  },
  {
    title: "Reservations",
    description: "Handle book reservations when copies are unavailable.",
    href: "/reservations",
    icon: CalendarClock,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">
            ReadMaxxing
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            A modern library management system for books, authors, users, loans, and reservations.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="group relative flex flex-col p-6 bg-card border border-border rounded-lg transition-colors duration-200 hover:bg-accent/50 hover:border-accent"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h2 className="text-lg font-medium">{feature.title}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground flex-1">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    Get started
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
