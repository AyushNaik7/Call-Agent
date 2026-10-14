"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { mockMessages } from "@/lib/mock-data";
import { formatPhoneNumber } from "@/lib/utils";
import { format } from "date-fns";

export default function MessagesPage() {
  const unreadMessages = mockMessages.filter((m) => m.status === "unread");
  const readMessages = mockMessages.filter((m) => m.status === "read");
  const resolvedMessages = mockMessages.filter((m) => m.status === "resolved");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Messages & Callbacks
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Customer callback requests and messages
          </p>
        </div>
        <Badge variant="error" className="text-sm">
          {unreadMessages.length} unread
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {unreadMessages.length}
                </p>
              </div>
              <div className="rounded-lg bg-red-50 p-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {readMessages.length}
                </p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {resolvedMessages.length}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unread Messages */}
      {unreadMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Unread Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {unreadMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-4 rounded-lg border-2 border-red-200 bg-red-50/50 p-4"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                    <Phone className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {msg.customerName}
                          </h3>
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
                        <p className="mt-1 text-sm text-gray-600">
                          {formatPhoneNumber(msg.customerPhone)}
                        </p>
                        <p className="mt-3 text-sm text-gray-900">
                          {msg.message}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          {format(msg.timestamp, "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Mark as Read
                        </Button>
                        <Button size="sm">Resolve</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Read Messages */}
      {readMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Read Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {readMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-4 rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {msg.customerName}
                          </h3>
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
                        <p className="mt-1 text-sm text-gray-600">
                          {formatPhoneNumber(msg.customerPhone)}
                        </p>
                        <p className="mt-3 text-sm text-gray-900">
                          {msg.message}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          {format(msg.timestamp, "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <Button size="sm">Resolve</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resolved Messages */}
      {resolvedMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resolved Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resolvedMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {msg.customerName}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {format(msg.timestamp, "MMM d")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
