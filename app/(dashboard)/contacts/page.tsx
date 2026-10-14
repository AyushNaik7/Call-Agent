"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, Plus, Search, Filter, Loader2, Edit, Trash2 } from "lucide-react";
import { getContacts, deleteContact } from "@/lib/actions/contacts";
import { formatPhoneNumber, getInitials } from "@/lib/utils";
import { format } from "date-fns";
import { ContactForm } from "@/components/contacts/contact-form";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadContacts = async () => {
    setLoading(true);
    const data = await getContacts();
    setContacts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleSuccess = () => {
    loadContacts();
    setFormOpen(false);
    setSelectedContact(null);
  };

  const handleEdit = (contact: any) => {
    setSelectedContact(contact);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedContact(null);
    setFormOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;
    
    setDeletingId(id);
    try {
      await deleteContact(id);
      await loadContacts();
    } catch (error) {
      alert("Failed to delete contact");
    } finally {
      setDeletingId(null);
    }
  };

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
            <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your customer contacts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="gap-2" onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Contacts Grid or Empty State */}
        {contacts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact: any) => (
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
                          {contact.calls?.[0]?.count || 0} calls
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

                  {contact.tags && contact.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {contact.tags.map((tag: string) => (
                        <Badge key={tag} variant="default">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {contact.updated_at && (
                    <p className="mt-3 text-xs text-gray-500">
                      Last updated: {format(new Date(contact.updated_at), "MMM d, yyyy")}
                    </p>
                  )}

                  {contact.notes && (
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                      {contact.notes}
                    </p>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(contact)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(contact.id, contact.name)}
                      disabled={deletingId === contact.id}
                    >
                      {deletingId === contact.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-600" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <User className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm">No contacts yet</p>
                <p className="mt-1 text-xs text-gray-400">
                  Contacts will be automatically created from calls and appointments
                </p>
                <Button size="sm" className="mt-4 gap-2" onClick={handleCreate}>
                  <Plus className="h-4 w-4" />
                  Add First Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <ContactForm
        open={formOpen}
        onOpenChange={setFormOpen}
        contact={selectedContact}
        onSuccess={handleSuccess}
      />
    </>
  );
}
