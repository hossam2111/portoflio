"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash, Loader2, Play, Upload } from "lucide-react";
import { slugify, extractYouTubeId, getYouTubeThumbnail } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [processField, setProcessField] = useState("");
  const [results, setResults] = useState("");
  const [technicalSpecs, setTechnicalSpecs] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [beforeImage, setBeforeImage] = useState("");
  const [afterImage, setAfterImage] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // Meta metadata
  const [clientName, setClientName] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [completionDate, setCompletionDate] = useState("");

  // SEO fields
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // Technologies & Materials list
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [newTech, setNewTech] = useState("");
  const [materials, setMaterials] = useState<string[]>([]);
  const [newMaterial, setNewMaterial] = useState("");

  // Gallery items
  const [gallery, setGallery] = useState<{ file_url: string; caption?: string; media_type?: "image" | "video" }[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newGalleryCaption, setNewGalleryCaption] = useState("");
  const [newGalleryMediaType, setNewGalleryMediaType] = useState<"image" | "video">("image");
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(slugify(val));
  };

  // Technologies helpers
  const addTech = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTech.trim()) {
      e.preventDefault();
      if (!technologies.includes(newTech.trim())) {
        setTechnologies([...technologies, newTech.trim()]);
      }
      setNewTech("");
    }
  };

  const removeTech = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  // Materials helpers
  const addMaterial = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newMaterial.trim()) {
      e.preventDefault();
      if (!materials.includes(newMaterial.trim())) {
        setMaterials([...materials, newMaterial.trim()]);
      }
      setNewMaterial("");
    }
  };

  const removeMaterial = (mat: string) => {
    setMaterials(materials.filter((m) => m !== mat));
  };

  // Gallery helpers
  const addGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl.trim()) return;
    setGallery([
      ...gallery,
      {
        file_url: newGalleryUrl.trim(),
        caption: newGalleryCaption.trim() || undefined,
        media_type: newGalleryMediaType,
      },
    ]);
    setNewGalleryUrl("");
    setNewGalleryCaption("");
    setNewGalleryMediaType("image");
  };

  const removeGalleryItem = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    try {
      setIsUploadingGallery(true);
      const formData = new FormData();
      formData.append("files", fileList[0]);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.files && data.files.length > 0) {
          setNewGalleryUrl(data.files[0].url);
          setNewGalleryMediaType(data.files[0].type);
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to upload file");
      }
    } catch (err) {
      console.error("Gallery file uploader error:", err);
      alert("An error occurred during file upload");
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Project title is required");
      return;
    }
    if (!categoryId) {
      setError("Please select a category");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    if (!coverImage.trim()) {
      setError("Cover image URL is required");
      return;
    }

    try {
      setIsSubmitLoading(true);
      setError("");

      const payload = {
        title,
        slug,
        description,
        challenge: challenge || undefined,
        solution: solution || undefined,
        process: processField || undefined,
        results: results || undefined,
        category_id: categoryId,
        cover_image: coverImage,
        client_name: clientName || undefined,
        location: location || undefined,
        duration: duration || undefined,
        completion_date: completionDate || undefined,
        featured,
        status,
        seo_title: seoTitle || undefined,
        seo_description: seoDescription || undefined,
        before_image: beforeImage || undefined,
        after_image: afterImage || undefined,
        technical_specs: technicalSpecs || undefined,
        youtube_url: youtubeUrl || undefined,
        technologies,
        materials,
        gallery,
      };

      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/projects");
      } else {
        setError(data.error || "Failed to create project");
      }
    } catch (err) {
      setError("An error occurred while creating project");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Get YouTube preview thumbnail
  const videoId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null;
  const videoThumbnail = videoId ? getYouTubeThumbnail(videoId) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/projects"
            className="p-2 rounded-lg text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#101722] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">New Project</h1>
            <p className="text-sm text-[#64748B]">Create a new portfolio project.</p>
          </div>
        </div>
        <button type="submit" disabled={isSubmitLoading} className="btn-primary text-sm flex items-center gap-2">
          {isSubmitLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Project
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Project Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="input-base"
                placeholder="e.g. Custom CNC Dressing Room"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="input-base font-mono"
                placeholder="auto-generated-slug"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-base resize-none"
                rows={4}
                placeholder="Provide a detailed description of the project..."
                required
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">Challenge</label>
                <textarea
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  className="input-base resize-none"
                  rows={3}
                  placeholder="What was the core design/engineering challenge?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Solution</label>
                <textarea
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="input-base resize-none"
                  rows={3}
                  placeholder="How did you solve the challenge?"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Process</label>
              <textarea
                value={processField}
                onChange={(e) => setProcessField(e.target.value)}
                className="input-base resize-none"
                rows={3}
                placeholder="Step 1: Design in CAD&#10;Step 2: CNC Milling..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Results</label>
              <textarea
                value={results}
                onChange={(e) => setResults(e.target.value)}
                className="input-base resize-none"
                rows={2}
                placeholder="Describe project delivery, metrics, and final results..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Technical Specifications</label>
              <textarea
                value={technicalSpecs}
                onChange={(e) => setTechnicalSpecs(e.target.value)}
                className="input-base resize-none font-mono text-xs"
                rows={4}
                placeholder="Material: 18mm MDF&#10;Finish: Matte lacquer&#10;Hardware: Blum hinges"
              />
            </div>
          </div>

          {/* YouTube Video URL Integration */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#F59E0B]">YouTube Video Embed</h3>
            <div>
              <label className="block text-sm font-medium mb-2">YouTube URL</label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="input-base"
                placeholder="e.g. https://www.youtube.com/watch?v=VIDEO_ID"
              />
            </div>
            {videoThumbnail && (
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#1E293B] relative group bg-black">
                <img src={videoThumbnail} alt="YouTube Preview" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Play className="w-12 h-12 text-[#F59E0B] fill-[#F59E0B]" />
                </div>
                <div className="absolute bottom-3 left-3 bg-black/75 px-3 py-1 rounded text-xs text-[#94A3B8] font-mono">
                  YouTube Video ID: {videoId}
                </div>
              </div>
            )}
          </div>

          {/* Before/After Transformation */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#F59E0B]">Before / After Images</h3>
            <p className="text-xs text-[#64748B] mb-2">Upload these images to Media Library, then paste their URLs here.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#64748B] mb-1.5">Before Image URL</label>
                <input
                  type="url"
                  value={beforeImage}
                  onChange={(e) => setBeforeImage(e.target.value)}
                  className="input-base text-sm"
                  placeholder="https://..."
                />
                {beforeImage && (
                  <div className="aspect-video rounded-xl overflow-hidden border border-[#1E293B] mt-2 bg-black">
                    <img src={beforeImage} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs text-[#64748B] mb-1.5">After Image URL</label>
                <input
                  type="url"
                  value={afterImage}
                  onChange={(e) => setAfterImage(e.target.value)}
                  className="input-base text-sm"
                  placeholder="https://..."
                />
                {afterImage && (
                  <div className="aspect-video rounded-xl overflow-hidden border border-[#1E293B] mt-2 bg-black">
                    <img src={afterImage} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Media Gallery Grid */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#F59E0B]">Project Gallery</h3>
            <div className="bg-[#05070A] p-4 rounded-xl border border-[#1E293B] space-y-4">
              <div className="grid sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <label className="block text-xs text-[#64748B] mb-1">Media URL (Image or Video)*</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      className="input-base text-sm"
                      placeholder="Paste image/video URL or upload ->"
                    />
                    <label className="btn-secondary text-xs shrink-0 cursor-pointer flex items-center justify-center px-3 gap-1.5 min-w-[90px]">
                      {isUploadingGallery ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      {isUploadingGallery ? "Uploading" : "Upload"}
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleGalleryFileUpload}
                        disabled={isUploadingGallery}
                      />
                    </label>
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs text-[#64748B] mb-1">Type</label>
                  <select
                    value={newGalleryMediaType}
                    onChange={(e) => setNewGalleryMediaType(e.target.value as "image" | "video")}
                    className="input-base text-sm"
                  >
                    <option value="image">Image (Photo)</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs text-[#64748B] mb-1">Caption (Optional)</label>
                  <input
                    type="text"
                    value={newGalleryCaption}
                    onChange={(e) => setNewGalleryCaption(e.target.value)}
                    className="input-base text-sm"
                    placeholder="e.g. Front View"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addGalleryItem}
                className="btn-secondary w-full text-xs"
              >
                Add Item to Gallery
              </button>
            </div>

            {/* Gallery list */}
            {gallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {gallery.map((item, index) => {
                  const isVideo = item.media_type === "video";
                  const ytId = isVideo ? extractYouTubeId(item.file_url) : null;
                  const ytThumbnail = ytId ? getYouTubeThumbnail(ytId) : null;

                  return (
                    <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#1E293B] bg-black group">
                      {isVideo ? (
                        ytThumbnail ? (
                          <div className="w-full h-full relative">
                            <img src={ytThumbnail} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="w-8 h-8 text-[#F59E0B] fill-[#F59E0B]" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full relative">
                            <video src={item.file_url} muted className="w-full h-full object-cover opacity-75" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="w-8 h-8 text-[#F59E0B] fill-[#F59E0B]" />
                            </div>
                          </div>
                        )
                      ) : (
                        <img src={item.file_url} className="w-full h-full object-cover" />
                      )}

                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-[#94A3B8] border border-[#1E293B]">
                        {item.media_type === "video" ? "Video" : "Photo"}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeGalleryItem(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-white z-10"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                      {item.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-black/80 p-2 text-[10px] text-[#94A3B8] truncate">
                          {item.caption}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#F59E0B]">SEO Settings</h3>
            <div>
              <label className="block text-sm font-medium mb-2">SEO Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="input-base"
                placeholder="SEO title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SEO Description</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="input-base resize-none"
                rows={2}
                placeholder="SEO description..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-sm font-semibold">Publish</h3>
            <div>
              <label className="block text-xs text-[#64748B] mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-base"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-[#F59E0B] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="featured" className="text-sm cursor-pointer select-none">Featured Project</label>
            </div>
          </div>

          <div className="glass-card p-5 space-y-4">
            <h3 className="text-sm font-semibold">Category *</h3>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input-base"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="glass-card p-5 space-y-4">
            <h3 className="text-sm font-semibold">Cover Image *</h3>
            <div>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="input-base text-sm mb-2"
                placeholder="Paste URL from Media Library"
                required
              />
              {coverImage && (
                <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#1E293B] bg-black">
                  <img src={coverImage} alt="Cover image preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-5 space-y-3">
            <h3 className="text-sm font-semibold">Project Details</h3>
            <div>
              <label className="block text-xs text-[#64748B] mb-1.5">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="input-base text-sm"
                placeholder="Client name"
              />
            </div>
            <div>
              <label className="block text-xs text-[#64748B] mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-base text-sm"
                placeholder="Project location"
              />
            </div>
            <div>
              <label className="block text-xs text-[#64748B] mb-1.5">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="input-base text-sm"
                placeholder="e.g. 3 Weeks"
              />
            </div>
            <div>
              <label className="block text-xs text-[#64748B] mb-1.5">Completion Date</label>
              <input
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="input-base text-sm"
              />
            </div>
          </div>

          {/* Technologies Tag input */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="text-sm font-semibold">Technologies</h3>
            <input
              type="text"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyDown={addTech}
              className="input-base text-sm"
              placeholder="Add technology (press Enter)"
            />
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {technologies.map((t) => (
                  <span
                    key={t}
                    onClick={() => removeTech(t)}
                    className="px-2.5 py-1 text-xs bg-[#101722] border border-[#1E293B] rounded-lg text-[#F59E0B] cursor-pointer hover:border-red-500 hover:text-red-400 transition-all flex items-center gap-1"
                  >
                    {t} &times;
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Materials Tag input */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="text-sm font-semibold">Materials</h3>
            <input
              type="text"
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              onKeyDown={addMaterial}
              className="input-base text-sm"
              placeholder="Add material (press Enter)"
            />
            {materials.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {materials.map((m) => (
                  <span
                    key={m}
                    onClick={() => removeMaterial(m)}
                    className="px-2.5 py-1 text-xs bg-[#101722] border border-[#1E293B] rounded-lg text-[#94A3B8] cursor-pointer hover:border-red-500 hover:text-red-400 transition-all flex items-center gap-1"
                  >
                    {m} &times;
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
