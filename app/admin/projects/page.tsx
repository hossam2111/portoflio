"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { useConfirm } from "@/components/admin/ConfirmDialog";

interface Project {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  cover_image: string;
  created_at: string;
  category?: {
    name: string;
  };
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const { confirm, Dialog } = useConfirm();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    const ok = await confirm({
      title: "Delete Project",
      message: `Are you sure you want to delete "${title}"? This will permanently remove the project and all its media. This action cannot be undone.`,
      confirmLabel: "Delete Project",
      danger: true,
    });
    if (!ok) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete project");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting project");
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredProjects = () => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category?.name.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === "Published") return project.status === "published";
      if (activeTab === "Draft") return project.status === "draft";
      if (activeTab === "Archived") return project.status === "archived";

      return true;
    });
  };

  const filteredProjects = getFilteredProjects();

  const countByStatus = (status?: string) => {
    if (!status) return projects.length;
    return projects.filter((p) => p.status === status).length;
  };

  const tabs = [
    { label: "All", count: countByStatus() },
    { label: "Published", count: countByStatus("published") },
    { label: "Draft", count: countByStatus("draft") },
    { label: "Archived", count: countByStatus("archived") },
  ];

  return (
    <div className="space-y-6">
      {Dialog}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Projects</h1>
          <p className="text-sm text-[#64748B]">Manage your portfolio projects.</p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-lg transition-all whitespace-nowrap cursor-pointer",
              activeTab === tab.label
                ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                : "text-[#64748B] hover:text-[#F1F5F9]"
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
        <input
          type="text"
          placeholder="Search projects by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-base pl-10"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#F59E0B] animate-spin" />
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E293B]">
                  <th className="text-left text-xs font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">
                    Project
                  </th>
                  <th className="text-left text-xs font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">
                    Category
                  </th>
                  <th className="text-left text-xs font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">
                    Date
                  </th>
                  <th className="text-right text-xs font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {filteredProjects.map((project, index) => (
                  <tr
                    key={project.id}
                    className="hover:bg-[#101722]/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <Link href={`/admin/projects/${project.id}`} className="flex items-center gap-3 hover:text-[#F59E0B] transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-[#101722] border border-[#1E293B] flex items-center justify-center shrink-0 overflow-hidden">
                          {project.cover_image ? (
                            <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-semibold text-[#F59E0B]">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium">{project.title}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#94A3B8]">
                      {project.category?.name || "Uncategorized"}
                    </td>
                    <td className="px-5 py-4">
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
                    </td>
                    <td className="px-5 py-4 text-sm text-[#64748B]">
                      {formatDate(project.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#101722] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="p-2 rounded-lg text-[#64748B] hover:text-[#F59E0B] hover:bg-[#101722] transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="p-2 rounded-lg text-[#64748B] hover:text-red-400 hover:bg-[#101722] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-sm text-[#64748B]">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
