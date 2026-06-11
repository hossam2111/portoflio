"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Upload } from "lucide-react";
import { slugify } from "@/lib/utils";
import { useConfirm } from "@/components/admin/ConfirmDialog";

interface Category {
  id: string;
  name: string;
  slug: string;
  cover_image?: string;
  count: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { confirm, Dialog } = useConfirm();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (res.ok) {
        setCategories(data);
      } else {
        setErrorMessage(data.error || "Failed to load categories");
      }
    } catch (err) {
      setErrorMessage("An error occurred while loading categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (name: string) => {
    setCategoryName(name);
    if (!editingCategory) {
      setCategorySlug(slugify(name));
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategorySlug("");
    setCoverImageUrl("");
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategorySlug(cat.slug);
    setCoverImageUrl(cat.cover_image || "");
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.files && data.files.length > 0) {
          setCoverImageUrl(data.files[0].url);
        }
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Failed to upload cover image");
      }
    } catch (err) {
      setErrorMessage("An error occurred during upload");
    } finally {
      setIsUploadingCover(false);
      e.target.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setErrorMessage("Category name is required");
      return;
    }

    try {
      setIsSubmitLoading(true);
      setErrorMessage("");

      const method = editingCategory ? "PUT" : "POST";
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName,
          slug: categorySlug || slugify(categoryName),
          cover_image: coverImageUrl || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        setErrorMessage(data.error || "Failed to save category");
      }
    } catch (err) {
      setErrorMessage("An error occurred while saving category");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string, count: number) => {
    const ok = await confirm({
      title: "Delete Category",
      message:
        count > 0
          ? `Warning: "${name}" contains ${count} project(s). Deleting it will remove the category from those projects. Are you sure?`
          : `Are you sure you want to delete the category "${name}"?`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete category");
      }
    } catch (err) {
      alert("An error occurred while deleting category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {Dialog}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Categories</h1>
          <p className="text-sm text-[#64748B]">Manage project categories and their cover images.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#F59E0B] animate-spin" />
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E293B]">
                <th className="text-left text-xs font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Cover</th>
                <th className="text-left text-xs font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Name</th>
                <th className="text-left text-xs font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Slug</th>
                <th className="text-left text-xs font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Projects</th>
                <th className="text-right text-xs font-medium text-[#64748B] uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#101722]/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="w-12 h-12 rounded-lg border border-[#1E293B] overflow-hidden bg-[#101722] flex items-center justify-center">
                      {cat.cover_image ? (
                        <img src={cat.cover_image} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-[#475569] text-center px-1">No cover</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium">{cat.name}</td>
                  <td className="px-5 py-4 text-sm text-[#64748B] font-mono">{cat.slug}</td>
                  <td className="px-5 py-4 text-sm text-[#94A3B8]">{cat.count}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-2 rounded-lg text-[#64748B] hover:text-[#F59E0B] hover:bg-[#101722] transition-colors"
                        title="Edit category"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name, cat.count)}
                        className="p-2 rounded-lg text-[#64748B] hover:text-red-400 hover:bg-[#101722] transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-[#64748B]">
                    No categories found. Click Add Category to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md p-6 space-y-4 border border-[#1E293B]">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="text-lg font-semibold">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#101722] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Name *</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="input-base"
                  placeholder="e.g. Dressing Rooms"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Slug *</label>
                <input
                  type="text"
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(slugify(e.target.value))}
                  className="input-base font-mono"
                  placeholder="e.g. dressing-rooms"
                  required
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Cover Image</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    className="input-base text-sm flex-1"
                    placeholder="Paste URL or upload →"
                  />
                  <label className="btn-secondary text-xs shrink-0 cursor-pointer flex items-center justify-center px-3 gap-1.5 min-w-[90px]">
                    {isUploadingCover ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    {isUploadingCover ? "Uploading" : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverUpload}
                      disabled={isUploadingCover}
                    />
                  </label>
                </div>
                {coverImageUrl && (
                  <div className="mt-2 w-full aspect-video rounded-xl overflow-hidden border border-[#1E293B] bg-black">
                    <img src={coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {errorMessage && (
                <p className="text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                  {errorMessage}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-sm"
                  disabled={isSubmitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-sm"
                  disabled={isSubmitLoading}
                >
                  {isSubmitLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingCategory ? "Save Changes" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
