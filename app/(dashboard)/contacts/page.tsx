"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, Plus, Search, Filter } from "lucide-react";
import { mockContacts } from "@/lib/mock-data";
import { formatPhoneNumber, getInitials } from "@/lib/utils";
import { format } from "date-fns";

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your customer contacts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts by name, phone, or email..."
              className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contacts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
                    {getInitials(contact.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {contact.totalCalls} calls
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  {formatPhoneNumber(contact.phone)}
                </div>
                {contact.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {contact.email}
                  </div>
                )}
              </div>

              {contact.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {contact.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {contact.lastCall && (
                <p className="mt-3 text-xs text-gray-500">
                  Last call: {format(contact.lastCall, "MMM d, yyyy")}
                </p>
              )}

              {contact.notes && (
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                  {contact.notes}
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (commented for when no contacts exist) */}
      {/* <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <User className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm">No contacts yet</p>
            <Button size="sm" className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Add First Contact
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
