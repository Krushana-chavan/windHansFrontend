"use client"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LogOut, User, Calendar, DollarSign, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) return null

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              EMS
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Link>

              {user.role === "worker" && (
                <>
                  <Link
                    href="/attendance"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Attendance
                  </Link>
                  <Link
                    href="/payments"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Payments
                  </Link>
                </>
              )}

              {user.role === "admin" && (
                <>
                  <Link
                    href="/admin/attendance"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Attendance
                  </Link>
                  <Link
                    href="/admin/payments"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Payments
                  </Link>
                  <Link
                    href="/admin/workers"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Workers
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{user.role}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
