"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, DollarSign, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  const workerCards = [
    {
      title: "Mark Attendance",
      description: "Record your daily attendance",
      icon: Calendar,
      href: "/attendance",
      color: "bg-blue-500",
    },
    {
      title: "View Payments",
      description: "Check your payment history",
      icon: DollarSign,
      href: "/payments",
      color: "bg-green-500",
    },
  ]

  const adminCards = [
    {
      title: "Manage Attendance",
      description: "View and manage worker attendance",
      icon: Calendar,
      href: "/admin/attendance",
      color: "bg-blue-500",
    },
    {
      title: "Manage Payments",
      description: "Process worker payments",
      icon: DollarSign,
      href: "/admin/payments",
      color: "bg-green-500",
    },
    {
      title: "Manage Workers",
      description: "View and manage worker accounts",
      icon: Users,
      href: "/admin/workers",
      color: "bg-purple-500",
    },
  ]

  const cards = user?.role === "admin" ? adminCards : workerCards

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="mt-2 text-gray-600">
              {user?.role === "admin" ? "Manage your workforce efficiently" : "Track your attendance and payments"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => {
              const Icon = card.icon
              return (
                <Link key={index} href={card.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                      <div className={`p-2 rounded-lg ${card.color} text-white mr-4`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        <CardDescription>{card.description}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>

         
        </div>
      </div>
    </ProtectedRoute>
  )
}
