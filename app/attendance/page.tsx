"use client"

import type React from "react"
import Swal from "sweetalert2";
import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, CheckCircle } from "lucide-react"
import { apiRequest } from "@/lib/api"

type AttendanceRecord = {
  date: string
  checkIn: string
  checkOut: string
  isPresent: boolean | string
}
export default function AttendancePage() {
  const { user } = useAuth()
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [status, setStatus] = useState<"present" | "absent" | "leave">("present")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")

  const [attendanceRecord,setAttendanceRecord] =  useState<AttendanceRecord[]>([]);
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate > today) {
    Swal.fire({
      icon: "error",
      title: "Invalid Date",
      text: "You cannot mark attendance for a future date.",
    });
    setLoading(false);
    return;
  }

  // ❌ Validate check-in and check-out
  if (!checkIn.trim() || !checkOut.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill in both Check-In and Check-Out times.",
    });
    setLoading(false);
    return;
  }

  const payload = {
    date,
    checkIn,
    checkOut,
    isPresent: true,
  };

  try {
    const data = await apiRequest({
      url: "/attendance/add",
      method: "POST",
      data: payload,
    });

    if (data.message) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: data.message,
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    setSuccess(true);
    setCheckIn("");
    setCheckOut("");

    getMyAtteandance();

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  } catch (error) {
    console.error("Error submitting attendance:", error);
    Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text: "There was a problem marking your attendance.",
    });
  } finally {
    setLoading(false);
  }
};



  const todayAttendance = [
    { date: "2024-01-15", status: "present", checkIn: "09:00", checkOut: "17:30" },
    { date: "2024-01-14", status: "present", checkIn: "09:15", checkOut: "17:45" },
    { date: "2024-01-13", status: "leave", checkIn: "-", checkOut: "-" },
    { date: "2024-01-12", status: "present", checkIn: "08:45", checkOut: "17:15" },
  ]

  const getMyAtteandance = async()=>{
 const data = await apiRequest({
      url: "/attendance/me",
      method: "GET",
      
    });
    setAttendanceRecord(data)

  }

  useEffect(()=>{
    getMyAtteandance()
  },[])


  return (
    <ProtectedRoute requiredRole="worker">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
            <p className="mt-2 text-gray-600">Mark your daily attendance and view your history</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mark Attendance Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Mark Attendance
                </CardTitle>
                <CardDescription>Record your attendance for today</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={status}
                      onValueChange={(value: "present" | "absent" | "leave") => setStatus(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="leave">Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}

                  {(
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="checkIn">Check In</Label>
                        <Input
                          id="checkIn"
                          type="time"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                         
                        />
                      </div>
                      <div>
                        <Label htmlFor="checkOut">Check Out</Label>
                        <Input
                          id="checkOut"
                          type="time"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          required={status === "present"}
                        />
                      </div>
                    </div>
                  )}

                

                  {success && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>Attendance marked successfully!</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Marking Attendance..." : "Mark Attendance"}
                  </Button>
                </form>

              </CardContent>
            </Card>

            {/* Attendance History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Attendance
                </CardTitle>
                <CardDescription>Your attendance history for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceRecord.map((record, index) => { 
                   return <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{record.date}</p>
                        <p className="text-sm text-gray-600">
                          {record.checkIn} - {record.checkOut}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${record.isPresent
                            ? "bg-green-100 text-green-800"
                            
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {record.isPresent?"Present":"Absent"}
                      </span>
                    </div>}
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
