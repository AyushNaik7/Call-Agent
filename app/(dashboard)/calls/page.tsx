"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Download, Filter, Search } from "lucide-react";
import { mockCalls } from "@/lib/mock-data";
import { formatDuration, formatPhoneNumber } from "@/lib/utils";
import { format } from "date-fns";

export default function CallsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Call History</h1>
          <p className="text-sm text-gray-600 mt-1">
            View and manage all incoming calls
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name, phone number, or outcome..."
              className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Calls List */}
      <Card>
        <CardHeader>
          <CardTitle>All Calls ({mockCalls.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Customer
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Phone
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Outcome
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Duration
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Time
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockCalls.map((call) => (
                  <tr
                    key={call.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          <Phone className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {call.customerName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {formatPhoneNumber(call.customerPhone)}
                    </td>
                    <td className="py-4">
                      <Badge
                        variant={
                          call.status === "completed"
                            ? "success"
                            : call.status === "missed"
                            ? "error"
                            : call.status === "voicemail"
                            ? "warning"
                            : "info"
                        }
                      >
                        {call.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-sm text-gray-900">
                      {call.outcome.replace(/_/g, " ")}
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {call.duration > 0 ? formatDuration(call.duration) : "-"}
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      <div>
                        <p>{format(call.timestamp, "MMM d, yyyy")}</p>
                        <p className="text-xs text-gray-500">
                          {format(call.timestamp, "h:mm a")}
                        </p>
                      </div>
                    </td>
                    <td className="py-4">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Call Details Modal Placeholder */}
      {/* Will be implemented with proper state management in later phases */}
    </div>
  );
}
