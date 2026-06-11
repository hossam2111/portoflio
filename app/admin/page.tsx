"use client";

import { useEffect, useState } from "react";
import {
  FolderOpen,
  Tags,
  Mail,
  Eye,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  status: "draft" | "published" | "archived";
  created_at: string;
  category?: {
    name: string;
  };
}

interface Message {
  id: string;
  name: string;
  subject: string;
  status: "new" | "read" | "archived";
  created_at: string;
}

interface Category {
  id: string;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        const [projRes, catRes, msgRes] = await Promise.all([
          fetch("/api/admin/projects"),
          fetch("/api/admin/categories"),
          fetch("/api/admin/messages"),
        ]);

        if (projRes.ok) setProjects(await projRes.json());
        if (catRes.ok) setCategories(await catRes.json());
        if (msgRes.ok) setMessages(await msgRes.json());
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.status === "published").length;
  const totalCategories = categories.length;
  const totalMessages = messages.length;

  const stats = [
    { label: "Total Projects", value: totalProjects, icon: FolderOpen, color: "text-blue-400 bg-blue-400/10" },
    { label: "Categories", value: totalCategories, icon: Tags, color: "text-emerald-400 bg-emerald-400/10" },
    { label: "Published", value: publishedProjects, icon: Eye, color: "text-[#F59E0B] bg-[#F59E0B]/10" },
    { label: "Messages", value: totalMessages, icon: Mail, color: "text-purple-400 bg-purple-400/10" },
  ];

  const recentProjects = projects.slice(0, 4);
  const recentMessages = messages.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#F59E0B] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm text-[#64748B]">
          Overview of your portfolio and recent activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.color)}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-0.5">{stat.value}</p>
              <p className="text-xs text-[#64748B]">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="glass-card">
            <div className="flex items-center justify-between p-5 border-b border-[#1E293B]">
              <h2 className="text-sm font-semibold">Recent Projects</h2>
              <Link
                href="/admin/projects"
                className="text-xs text-[#F59E0B] hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-[#1E293B]">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 hover:bg-[#101722]/50 transition-colors"
                >
                  <Link href={`/admin/projects/${project.id}`} className="flex items-center gap-3 hover:text-[#F59E0B] transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-[#101722] border border-[#1E293B] flex items-center justify-center">
                      <FolderOpen className="w-4 h-4 text-[#64748B]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{project.title}</p>
                      <p className="text-xs text-[#64748B]">{project.category?.name || "Uncategorized"}</p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "badge text-xs",
                        project.status === "published"
                          ? "badge-published"
                          : project.status === "draft"
                          ? "badge-draft"
                          : "badge-archived"
                      )}
                    >
                      {project.status}
                    </span>
                    <span className="text-xs text-[#64748B] hidden sm:block">
                      {formatDate(project.created_at)}
                    </span>
                  </div>
                </div>
              ))}
              {recentProjects.length === 0 && (
                <div className="p-5 text-center text-xs text-[#64748B]">
                  No projects created yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div>
          <div className="glass-card">
            <div className="flex items-center justify-between p-5 border-b border-[#1E293B]">
              <h2 className="text-sm font-semibold">Recent Messages</h2>
              <Link
                href="/admin/messages"
                className="text-xs text-[#F59E0B] hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-[#1E293B]">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 hover:bg-[#101722]/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{msg.name}</p>
                    {msg.status === "new" && (
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                    )}
                  </div>
                  <p className="text-xs text-[#94A3B8] mb-1 truncate">{msg.subject}</p>
                  <p className="text-xs text-[#64748B]">{formatDate(msg.created_at)}</p>
                </div>
              ))}
              {recentMessages.length === 0 && (
                <div className="p-5 text-center text-xs text-[#64748B]">
                  No messages received yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
