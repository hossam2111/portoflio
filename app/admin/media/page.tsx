"use client";

import { useEffect, useState } from "react";
import { Upload, Search, Trash2, Image, Film, Check, Loader2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  name: string;
  created_at: string;
  size: string;
  type: "image" | "video";
  url: string;
}

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setMediaItems(data);
      }
    } catch (err) {
      console.error("Failed to load media items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid copying url when checking checkbox
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const selectAll = () => {
    const filtered = getFilteredItems();
    if (selectedItems.length === filtered.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filtered.map((m) => m.id));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        formData.append("files", fileList[i]);
      }

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        fetchMedia();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to upload files");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("An error occurred during file upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleBulkDelete = async () => {
    const selectedNames = mediaItems
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => item.name);

    if (selectedNames.length === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedNames.length} selected files?`)) return;

    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileNames: selectedNames }),
      });

      if (res.ok) {
        setMediaItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
        setSelectedItems([]);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete files");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred during file deletion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSingleDelete = async (name: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete this file: ${name}?`)) return;

    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileNames: [name] }),
      });

      if (res.ok) {
        setMediaItems((prev) => prev.filter((item) => item.id !== id));
        setSelectedItems((prev) => prev.filter((x) => x !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete file");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred during file deletion");
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredItems = () => {
    return mediaItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (activeTab === "Images") return item.type === "image";
      if (activeTab === "Videos") return item.type === "video";
      return true;
    });
  };

  const filteredItems = getFilteredItems();
  const tabs = ["All", "Images", "Videos"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Media Library</h1>
          <p className="text-sm text-[#64748B]">Manage your images and videos. Click an item to copy its URL.</p>
        </div>
        <label className="btn-primary text-sm cursor-pointer flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Files
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg">
          <span className="text-sm text-[#F59E0B]">
            {selectedItems.length} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Bulk Delete
          </button>
          <button
            onClick={() => setSelectedItems([])}
            className="text-xs text-[#64748B] hover:text-[#F1F5F9] ml-auto cursor-pointer"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Tabs + Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg transition-all cursor-pointer",
                activeTab === tab
                  ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                  : "text-[#64748B] hover:text-[#F1F5F9]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={selectAll}
            className="text-xs text-[#64748B] hover:text-[#F1F5F9] cursor-pointer"
          >
            Select All
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base pl-10 py-2 text-sm w-48"
            />
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <label className={cn(
        "border-2 border-dashed border-[#1E293B] rounded-xl p-8 text-center hover:border-[#F59E0B]/30 transition-colors cursor-pointer block",
        isUploading && "pointer-events-none opacity-50"
      )}>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        {isUploading ? (
          <div className="space-y-2">
            <Loader2 className="w-8 h-8 text-[#F59E0B] animate-spin mx-auto" />
            <p className="text-sm text-[#94A3B8]">Uploading files to Supabase Storage...</p>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-[#64748B] mx-auto mb-3" />
            <p className="text-sm text-[#94A3B8] mb-1">Drag & drop files here, or click to browse</p>
            <p className="text-xs text-[#64748B]">Supports bulk upload — JPG, PNG, WebP, MP4, MOV, WebM</p>
          </>
        )}
      </label>

      {/* Media Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#F59E0B] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCopyUrl(item.url)}
              className={cn(
                "relative aspect-square rounded-xl border bg-gradient-to-br from-[#101722] to-[#0E141D] overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-all group border-[#1E293B] hover:border-[#334155]"
              )}
            >
              {/* Checkbox indicator */}
              <button
                onClick={(e) => toggleSelect(item.id, e)}
                className={cn(
                  "absolute top-2 left-2 w-5 h-5 rounded border flex items-center justify-center z-10 transition-colors border-[#1E293B] hover:border-[#F59E0B]",
                  selectedItems.includes(item.id) ? "bg-[#F59E0B] border-[#F59E0B]" : "bg-[#0E141D]/80"
                )}
              >
                {selectedItems.includes(item.id) && <Check className="w-3.5 h-3.5 text-[#05070A]" />}
              </button>

              {/* Clipboard feedback overlay */}
              {copiedUrl === item.url && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center text-xs text-[#F59E0B] font-semibold z-20">
                  <Check className="w-6 h-6 mb-1 text-emerald-400" />
                  Copied URL!
                </div>
              )}

              {/* Delete Button */}
              <button
                onClick={(e) => handleSingleDelete(item.name, item.id, e)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                title="Delete file"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Copy URL Hover Indicator */}
              <div className="absolute top-2 right-10 p-1.5 rounded-lg bg-[#0E141D]/80 border border-[#1E293B] opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Copy className="w-3 h-3 text-[#94A3B8]" />
              </div>

              {/* Thumbnail / Media Preview */}
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center relative">
                  <Film className="w-10 h-10 text-[#64748B]" />
                  <span className="absolute bottom-2 right-2 text-[8px] bg-black/60 px-1 py-0.5 rounded text-[#94A3B8]">VIDEO</span>
                </div>
              )}

              {/* Title Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-left">
                <p className="text-[10px] text-[#F1F5F9] truncate font-medium">
                  {item.name}
                </p>
                <p className="text-[9px] text-[#64748B] mt-0.5">
                  {item.size}
                </p>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-20 text-sm text-[#64748B]">
              No media items found. Upload some files to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
