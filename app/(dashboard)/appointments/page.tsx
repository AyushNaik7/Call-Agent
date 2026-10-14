"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Filter, Mail, Phone, Loader2 } from "lucide-react";
import { getAppointments, deleteAppointment, updateAppointment } from "@/lib/actions/appointments";
import { formatPhoneNumber } from "@/lib/utils";
import { format } from "date-fns";
import { AppointmentForm } from "@/components/appointments/appointment-form";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadAppointments = async () => {
    setLoading(true);
    const data = await getAppointments();
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleSuccess = () => {
    loadAppointments();
    setFormOpen(false);
    setSelectedAppointment(null);
  };

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedAppointment(null);
    setFormOpen(true);
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    
    setCancellingId(id);
    try {
      await updateAppointment(id, { status: "cancelled" });
      await loadAppointments();
    } catch (error) {
      alert("Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

  const now = new Date();
  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.date_time) > now && a.status !== "cancelled"
  );
  const pastAppointments = appointments.filter(
    (a) => new Date(a.date_time) <= now || a.status === "cancelled"
  );

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage bookings and schedule
            </p>
          </div>
          <Button size="sm" className="gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
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
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {
                      upcomingAppointments.filter((a) => {
                        const apptDate = new Date(a.date_time);
                        return apptDate.toDateString() === now.toDateString();
                      }).length
                    }
                  </p>
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
                      upcomingAppointments.filter((a) => {
                        const apptDate = new Date(a.date_time);
                        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                        return apptDate < weekFromNow;
                      }).length
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
                        {format(new Date(appt.date_time), "MMM")}
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        {format(new Date(appt.date_time), "d")}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {appt.customer_name}
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
                              {format(new Date(appt.date_time), "h:mm a")} ({appt.duration} min)
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {formatPhoneNumber(appt.customer_phone)}
                            </div>
                            {appt.customer_email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {appt.customer_email}
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(appt)}
                          >
                            Reschedule
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCancel(appt.id)}
                            disabled={cancellingId === appt.id}
                          >
                            {cancellingId === appt.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Cancel"
                            )}
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
                <Button size="sm" className="mt-4 gap-2" onClick={handleCreate}>
                  <Plus className="h-4 w-4" />
                  Schedule First Appointment
                </Button>
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
                {pastAppointments.slice(0, 10).map((appt) => (
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
                          {appt.customer_name}
                        </p>
                        <p className="text-sm text-gray-600">{appt.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">
                        {format(new Date(appt.date_time), "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(appt.date_time), "h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <AppointmentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        appointment={selectedAppointment}
        onSuccess={handleSuccess}
      />
    </>
  );
}
