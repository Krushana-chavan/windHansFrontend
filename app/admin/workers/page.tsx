"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Mail, Calendar, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/api"
 interface Worker {
  id: number;
  name: string;
  email: string;
  role: 'worker';
}
export default function AdminWorkersPage() {

const [workers, setWorkers] = useState<Worker[]>([]);
 const [activeWorkers, setActiveWorkers] = useState()
   const getWorkerStaticsandlist = async()=>{
   const data = await apiRequest({
        url: "/admin/workers  ",
        method: "GET",
        
      });
      setWorkers(data?.workers)
      setActiveWorkers(data?.activeWorkers)
  
    }
  // const workers = [
  //   {
  //     id: "2",
  //     name: "John Doe",
  //     email: "john@company.com",
  //     joinDate: "2023-06-15",
  //     totalEarnings: 45000,
  //     attendanceRate: 92,
  //     status: "active",
  //   },
  //   {
  //     id: "3",
  //     name: "Jane Smith",
  //     email: "jane@company.com",
  //     joinDate: "2023-08-20",
  //     totalEarnings: 38000,
  //     attendanceRate: 88,
  //     status: "active",
  //   },
  //   {
  //     id: "4",
  //     name: "Mike Johnson",
  //     email: "mike@company.com",
  //     joinDate: "2023-09-10",
  //     totalEarnings: 42000,
  //     attendanceRate: 95,
  //     status: "active",
  //   },
  // ]

  useEffect(()=>{getWorkerStaticsandlist()},[])

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Worker Management</h1>
            <p className="mt-2 text-gray-600">Manage worker accounts and view their performance</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workers.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />

              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {activeWorkers}
                </div>
              </CardContent>
            </Card>


            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {/* <div className="text-2xl font-bold">
                  ₹{workers.reduce((sum, w) => sum + w.totalEarnings, 0).toLocaleString()}
                </div> */}
              </CardContent>
            </Card>
          </div>

          {/* Worker List */}
          <Card>
            <CardHeader>
              <CardTitle>Worker Directory</CardTitle>
              <CardDescription>Complete list of all workers and their details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                { workers && workers?.map((worker) => (
                  <div key={worker.id} className="flex items-center justify-between p-6 border rounded-lg">
                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {worker.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold">{worker.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {worker.email}
                          </div>
                          {/* <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Joined {new Date(worker.joinDate).toLocaleDateString()}
                          </div> */}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* <div className="text-right">
                        <p className="text-sm text-gray-600">Total Earnings</p>
                        <p className="font-semibold">₹{worker.totalEarnings.toLocaleString()}</p>
                      </div> */}

                      {/* <div className="text-right">
                        <p className="text-sm text-gray-600">Attendance Rate</p>
                        <p className="font-semibold">{worker.attendanceRate}%</p>
                      </div> */}

                      <div className="flex flex-col items-end space-y-2">
                        {/* <Badge
                          variant={worker.status === "active" ? "default" : "secondary"}
                          className={worker.status === "active" ? "bg-green-100 text-green-800" : ""}
                        >
                          {worker.status}
                        </Badge> */}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
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
