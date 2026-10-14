"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Filter, Mail, Phone } from "lucide-react";
import { mockAppointments, Appointment } from "@/lib/mock-data";
import { formatPhoneNumber } from "@/lib/utils";
import { format } from "date-fns";

export default function AppointmentsPage() {
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const now = new Date();
    setUpcomingAppointments(mockAppointments.filter((a) => a.dateTime > now));
    setPastAppointments(mockAppointments.filter((a) => a.dateTime <= now));
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage bookings and schedule
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Upcoming
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {upcomingAppointments.length}
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Today
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  This Week
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {
                    upcomingAppointments.filter(
                      (a) =>
                        a.dateTime <
                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    ).length
                  }
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-blue-50">
                    <p className="text-xs font-medium text-blue-600">
                      {format(appt.dateTime, "MMM")}
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {format(appt.dateTime, "d")}
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {appt.customerName}
                          </h3>
                          <Badge
                            variant={
                              appt.status === "confirmed"
                                ? "success"
                                : appt.status === "pending"
                                ? "warning"
                                : "default"
                            }
                          >
                            {appt.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {appt.service}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {format(appt.dateTime, "h:mm a")} ({appt.duration}{" "}
                            min)
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {formatPhoneNumber(appt.customerPhone)}
                          </div>
                          {appt.customerEmail && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {appt.customerEmail}
                            </div>
                          )}
                        </div>
                        {appt.notes && (
                          <p className="mt-2 text-sm text-gray-600">
                            Note: {appt.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="ghost" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <Calendar className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm">No upcoming appointments</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Past Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <Calendar className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {appt.customerName}
                      </p>
                      <p className="text-sm text-gray-600">{appt.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">
                      {format(appt.dateTime, "MMM d, yyyy")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(appt.dateTime, "h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
