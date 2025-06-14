"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DollarSign, Plus, Calendar } from "lucide-react"
import { apiRequest } from "@/lib/api"
import Swal from "sweetalert2"
 interface Worker {
  id: string ;
  name: string;
  email: string;
  role: 'worker';
}
export interface PaymentSummary {
  id: number;
  userId: number;
  name: string;
  fromDate: string;     
  toDate: string;     
  daysWorked: number;
  amount: number;
  paidOn: string;       
}
export default function AdminPaymentsPage() {
  const [selectedWorker, setSelectedWorker] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [amount, setAmount] = useState("")
  const [payment,setPayment] = useState<PaymentSummary[]>([])
  const [averagePayment, setAveragePayment] = useState('')
  const [paymentCount, setPaymentCount] = useState('')
  const [totalPaidCount,setTotalPaidCount] = useState('')
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)


const [workers, setWorkers] = useState<Worker[]>([]);

   const getWorkerStaticsandlist = async()=>{
   const data = await apiRequest({
        url: "/admin/workers  ",
        method: "GET",
        
      });
      setWorkers(data?.workers)
  
    }

    const getAllStatistic = async()=>{
      const data = await apiRequest({
        url:'/payment/summary',

      })
      setPayment(data?.recentPayments)
      setAveragePayment(data?.averagePayment)
      setTotalPaidCount(data?.totalPaid)
      setPaymentCount(data?.paymentsMade)
    }
  
  useEffect(()=>{
    getAllStatistic()
    getWorkerStaticsandlist()
  },[])

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    const payload = {
    userId: selectedWorker,
    fromDate: fromDate,
    toDate: toDate
    }

     const data = await apiRequest({
      url: `/payment`,
      method: "POST",
      data:payload
     })
     if(data?.message){
      Swal.fire({
        title:'Error',
        text:data.message,
        timer:2000
      })
     }
    setIsDialogOpen(false)
    // Reset form
    setSelectedWorker("")
    setFromDate("")
    setToDate("")
    setAmount("")
  }


  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="mt-2 text-gray-600">Manage worker payments and salary records</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Payment</DialogTitle>
                  <DialogDescription>Record a new payment for a worker</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddPayment} className="space-y-4">
                  <div>
                    <Label htmlFor="worker">Worker</Label>
                    <Select value={selectedWorker} onValueChange={setSelectedWorker} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select worker" />
                      </SelectTrigger>
                      <SelectContent>
                        {workers.map((worker) => (
                          <SelectItem key={worker.id} value={worker.id.toString()}>
                            {worker.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fromDate">From Date</Label>
                      <Input
                        id="fromDate"
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="toDate">To Date</Label>
                      <Input
                        id="toDate"
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                 

                  <Button type="submit" className="w-full">
                    Add Payment
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalPaidCount.toString()}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payments Made</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paymentCount}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Payment</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{averagePayment}</div>
                <p className="text-xs text-muted-foreground">Per worker</p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Records */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Records</CardTitle>
              <CardDescription>Recent salary payments to workers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payment.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{payment.name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(payment.fromDate).toLocaleDateString()} -{" "}
                          {new Date(payment.toDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">{payment.daysWorked} days worked</p>
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
