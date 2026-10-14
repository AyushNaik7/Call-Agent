"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  PhoneIncoming,
  PhoneMissed,
  Calendar,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  mockCalls,
  mockAppointments,
  mockMessages,
  mockAnalytics,
  Appointment,
  Message,
} from "@/lib/mock-data";
import { formatDuration, formatPhoneNumber } from "@/lib/utils";
import { format } from "date-fns";

export default function DashboardPage() {
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);

  useEffect(() => {
    const now = new Date();
    setUpcomingAppointments(
      mockAppointments
        .filter((a) => a.dateTime > now && a.status === "confirmed")
        .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
        .slice(0, 3)
    );
    setUnreadMessages(mockMessages.filter((m) => m.status === "unread"));
  }, []);

  const recentCalls = mockCalls.slice(0, 5);

  const stats = [
    {
      title: "Total Calls Today",
      value: "24",
      change: "+12%",
      icon: Phone,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Calls Answered",
      value: "22",
      change: "91.7%",
      icon: PhoneIncoming,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Missed Calls",
      value: "2",
      change: "-50%",
      icon: PhoneMissed,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Appointments Booked",
      value: "8",
      change: "+20%",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-600 mt-1">
          Monitor your AI receptionist performance and recent activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-600">
                        {stat.change}
                      </span>
                      <span className="text-gray-600">vs last week</span>
                    </div>
                  </div>
                  <div className={`${stat.bgColor} rounded-lg p-3`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Calls */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <Phone className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {call.customerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPhoneNumber(call.customerPhone)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        call.status === "completed"
                          ? "success"
                          : call.status === "missed"
                          ? "error"
                          : "default"
                      }
                    >
                      {call.outcome.replace("_", " ")}
                    </Badge>
                    <p className="mt-1 text-xs text-gray-500">
                      {format(call.timestamp, "h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {appt.customerName}
                        </p>
                        <p className="text-sm text-gray-600">{appt.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {format(appt.dateTime, "MMM d")}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        {format(appt.dateTime, "h:mm a")}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-sm">No upcoming appointments</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Messages */}
      {unreadMessages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Messages & Callbacks</CardTitle>
              <Badge variant="error">{unreadMessages.length} unread</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {unreadMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-4 rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                    <Phone className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {msg.customerName}
                      </p>
                      <Badge
                        variant={
                          msg.priority === "high"
                            ? "error"
                            : msg.priority === "medium"
                            ? "warning"
                            : "default"
                        }
                      >
                        {msg.priority} priority
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{msg.message}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      {formatPhoneNumber(msg.customerPhone)} •{" "}
                      {format(msg.timestamp, "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call Distribution Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalytics.callsByDay.map((day) => (
              <div key={day.date} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-gray-600">
                  {day.date}
                </div>
                <div className="flex-1">
                  <div className="h-8 rounded-lg bg-gray-100">
                    <div
                      className="h-full rounded-lg bg-blue-600 transition-all"
                      style={{ width: `${(day.count / 35) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-medium text-gray-900">
                  {day.count}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
