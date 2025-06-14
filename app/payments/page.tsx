"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Calendar, TrendingUp } from "lucide-react"
import { apiRequest } from "@/lib/api"
import { useEffect, useState } from "react"
interface PaymentRecord {
  id: number;
  fromDate: string;    // e.g. "2025-06-12"
  toDate: string;      // e.g. "2025-06-14"
  daysWorked: number;
  amount: number;
  paidOn: string;      // ISO datetime string e.g. "2025-06-13T16:38:20.508Z"
}
export default function PaymentsPage() {


  const [totalEarnings,setTotalEarnings] = useState('')
  const [payments,setPayments] = useState<PaymentRecord[]>([])
  const [averagePayment,setAveragePayment] = useState('')
  const [thisMonthEarning,setThisMonthEarning] = useState('')
  const getAllStatistic = async() =>{

    const data = await apiRequest({
      url:'/payment/summary/me'
    })
    setAveragePayment(data?.averageMonthlyEarning)
    setPayments(data?.paymentRecords)
    setThisMonthEarning(data?.thisMonthEarnings)
    setTotalEarnings(data?.totalEarnings)
  }

  useEffect(()=>{
    getAllStatistic()
  },[])

  return (
    <ProtectedRoute requiredRole="worker">
      <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
            <p className="mt-2 text-gray-600">View your payment records and earnings</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{thisMonthEarning}</div>
              
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Monthly</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{averagePayment}
                </div>
              
              </CardContent>
            </Card>
          </div>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Records</CardTitle>
              <CardDescription>Detailed history of your salary payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">
                            {new Date(payment.fromDate).toLocaleDateString()} -{" "}
                            {new Date(payment.toDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">{payment.daysWorked} days worked</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-bold text-lg">₹{payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Paid on {new Date(payment.paidOn).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="secondary">Paid</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
