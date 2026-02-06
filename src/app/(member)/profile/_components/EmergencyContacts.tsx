"use client";

import { useState } from "react";
import {
  IconPhoneCall,
  IconPlus,
  IconEdit,
  IconTrash,
  IconDeviceFloppy,
  IconX,
} from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatPhoneNumber } from "@/lib/utils/format";

interface Contact {
  id: number;
  name: string;
  phone: string;
  relationship: string;
}

const initialContacts: Contact[] = [
  { id: 1, name: "Maria Rivera", phone: "3175550123", relationship: "Mother" },
  { id: 2, name: "Carlos Rivera", phone: "3175550456", relationship: "Father" },
];

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", relationship: "" });

  function handleEdit(contact: Contact) {
    setEditingId(contact.id);
    setForm({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
    });
    setShowAdd(false);
  }

  function handleSaveEdit() {
    if (!editingId) return;
    setContacts((prev) =>
      prev.map((c) =>
        c.id === editingId
          ? { ...c, name: form.name, phone: form.phone, relationship: form.relationship }
          : c
      )
    );
    setEditingId(null);
    setForm({ name: "", phone: "", relationship: "" });
  }

  function handleDelete(id: number) {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({ name: "", phone: "", relationship: "" });
    }
  }

  function handleAdd() {
    if (!form.name.trim() || !form.phone.trim()) return;
    const newId = Math.max(0, ...contacts.map((c) => c.id)) + 1;
    setContacts((prev) => [
      ...prev,
      { id: newId, name: form.name, phone: form.phone, relationship: form.relationship },
    ]);
    setShowAdd(false);
    setForm({ name: "", phone: "", relationship: "" });
  }

  function handleCancel() {
    setEditingId(null);
    setShowAdd(false);
    setForm({ name: "", phone: "", relationship: "" });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="inline-flex items-center gap-2">
            <IconPhoneCall className="size-5" stroke={1.5} />
            Emergency Contacts
          </CardTitle>
          {!showAdd && editingId === null && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAdd(true);
                setForm({ name: "", phone: "", relationship: "" });
              }}
            >
              <IconPlus className="mr-1 size-3.5" stroke={1.5} />
              Add Contact
            </Button>
          )}
        </div>
        <CardDescription>
          Emergency contacts for event safety purposes.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {contacts.length === 0 && !showAdd && (
          <p className="text-sm text-muted-foreground">
            No emergency contacts added yet.
          </p>
        )}

        {contacts.map((contact) => (
          <div key={contact.id}>
            {editingId === contact.id ? (
              <div className="space-y-3 rounded border p-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium">Name</span>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium">Phone</span>
                    <Input
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium">Relationship</span>
                    <Input
                      value={form.relationship}
                      onChange={(e) =>
                        setForm({ ...form, relationship: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveEdit}>
                    <IconDeviceFloppy className="mr-1 size-3.5" stroke={1.5} />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <IconX className="mr-1 size-3.5" stroke={1.5} />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-sm">
                <div className="flex flex-col">
                  <span className="font-medium">{contact.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {contact.relationship} · {formatPhoneNumber(contact.phone)}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleEdit(contact)}
                  >
                    <IconEdit className="size-3" stroke={1.5} />
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <IconTrash className="size-3" stroke={1.5} />
                  </Button>
                </div>
              </div>
            )}
            {contact.id !== contacts[contacts.length - 1]?.id && (
              <Separator className="mt-3" />
            )}
          </div>
        ))}

        {/* Add new contact form */}
        {showAdd && (
          <>
            {contacts.length > 0 && <Separator />}
            <div className="space-y-3 rounded border p-3">
              <h4 className="text-sm font-medium">New Contact</h4>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">Name</span>
                  <Input
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">Phone</span>
                  <Input
                    placeholder="(555) 123-4567"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">Relationship</span>
                  <Input
                    placeholder="e.g. Mother, Father"
                    value={form.relationship}
                    onChange={(e) =>
                      setForm({ ...form, relationship: e.target.value })
                    }
                  />
                </label>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAdd}>
                  <IconPlus className="mr-1 size-3.5" stroke={1.5} />
                  Add
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <IconX className="mr-1 size-3.5" stroke={1.5} />
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}