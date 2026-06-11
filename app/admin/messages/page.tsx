"use client";

import { useEffect, useState } from "react";
import { Mail, Eye, Archive, Trash2, Loader2, Phone } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { useConfirm } from "@/components/admin/ConfirmDialog";

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "archived";
  created_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const { confirm, Dialog } = useConfirm();

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string, currentStatus: string) => {
    if (currentStatus !== "new") return;

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, status: "read" } : msg))
        );
      }
    } catch (err) {
      console.error("Failed to mark message as read:", err);
    }
  };

  const handleArchive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, status: "archived" } : msg))
        );
      }
    } catch (err) {
      console.error("Failed to archive message:", err);
    }
  };

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const ok = await confirm({
      title: "Delete Message",
      message: `Are you sure you want to permanently delete the message from "${name}"?`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
        if (selectedMessageId === id) {
          setSelectedMessageId(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const toggleSelectMessage = (msg: Message) => {
    if (selectedMessageId === msg.id) {
      setSelectedMessageId(null);
    } else {
      setSelectedMessageId(msg.id);
      markAsRead(msg.id, msg.status);
    }
  };

  const statusColors: Record<string, string> = {
    new: "badge-published",
    read: "badge-draft",
    archived: "badge-archived",
  };

  const selectedMsg = messages.find((m) => m.id === selectedMessageId);

  return (
    <div className="space-y-6">
      {Dialog}
      <div>
        <h1 className="text-2xl font-bold mb-1">Messages</h1>
        <p className="text-sm text-[#64748B]">View and manage contact form submissions.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#F59E0B] animate-spin" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List Table */}
          <div className={cn("glass-card overflow-hidden", selectedMessageId ? "lg:col-span-2" : "lg:col-span-3")}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1E293B]">
                    <th className="text-left text-xs font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">From</th>
                    <th className="text-left text-xs font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Subject</th>
                    <th className="text-left text-xs font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Date</th>
                    <th className="text-right text-xs font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]">
                  {messages.map((msg) => (
                    <tr
                      key={msg.id}
                      className={cn(
                        "hover:bg-[#101722]/50 transition-colors cursor-pointer",
                        msg.status === "new" && "bg-[#F59E0B]/[0.02]",
                        selectedMessageId === msg.id && "bg-[#101722]"
                      )}
                      onClick={() => toggleSelectMessage(msg)}
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium">{msg.name}</p>
                          <p className="text-xs text-[#64748B]">{msg.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#94A3B8] max-w-[150px] truncate">{msg.subject}</td>
                      <td className="px-5 py-4">
                        <span className={`badge text-xs ${statusColors[msg.status]}`}>
                          {msg.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#64748B] whitespace-nowrap">
                        {formatDate(msg.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleSelectMessage(msg)}
                            className="p-2 rounded-lg text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#101722] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {msg.status !== "archived" && (
                            <button
                              onClick={(e) => handleArchive(msg.id, e)}
                              className="p-2 rounded-lg text-[#64748B] hover:text-[#F59E0B] hover:bg-[#101722] transition-colors"
                              title="Archive Message"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDelete(msg.id, msg.name, e)}
                            className="p-2 rounded-lg text-[#64748B] hover:text-red-400 hover:bg-[#101722] transition-colors"
                            title="Delete Message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {messages.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-sm text-[#64748B]">
                        No messages found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expanded Message View Panel */}
          {selectedMsg && (
            <div className="glass-card p-6 h-fit space-y-4">
              <div className="flex justify-between items-start border-b border-[#1E293B] pb-4">
                <div>
                  <h3 className="font-bold text-lg">{selectedMsg.name}</h3>
                  <p className="text-sm text-[#94A3B8]">{selectedMsg.email}</p>
                  {selectedMsg.phone && (
                    <p className="text-sm text-[#64748B] flex items-center gap-1.5 mt-1">
                      <Phone className="w-3.5 h-3.5" />
                      {selectedMsg.phone}
                    </p>
                  )}
                </div>
                <span className={`badge text-xs ${statusColors[selectedMsg.status]}`}>
                  {selectedMsg.status}
                </span>
              </div>

              <div>
                <p className="text-xs text-[#64748B] uppercase tracking-wider font-semibold">Subject</p>
                <p className="text-sm font-medium mt-1">{selectedMsg.subject}</p>
              </div>

              <div className="border-t border-[#1E293B] pt-4">
                <p className="text-xs text-[#64748B] uppercase tracking-wider font-semibold mb-2">Message</p>
                <div className="bg-[#05070A] p-4 rounded-xl border border-[#1E293B] text-sm text-[#94A3B8] leading-relaxed whitespace-pre-line">
                  {selectedMsg.message}
                </div>
              </div>

              <div className="text-xs text-[#64748B] text-right font-mono">
                Received: {formatDate(selectedMsg.created_at)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
