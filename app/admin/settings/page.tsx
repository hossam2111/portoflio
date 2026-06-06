"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    hero_title: "",
    hero_description: "",
    about_content: "",
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    facebook_url: "",
    linkedin_url: "",
    instagram_url: "",
    seo_title: "",
    seo_description: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          // Merge defaults in case db fields are null
          setFormData((prev) => ({
            ...prev,
            ...data,
          }));
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError("");
      setSuccess(false);

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save settings");
      }
    } catch (err) {
      setError("An error occurred while saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#F59E0B] animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Settings</h1>
          <p className="text-sm text-[#64748B]">
            Manage your website content and configuration.
          </p>
        </div>
        <button type="submit" disabled={isSaving} className="btn-primary text-sm flex items-center gap-2">
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : success ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : success ? "Saved" : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
          {error}
        </div>
      )}

      {/* Hero Settings */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#F59E0B]">Hero Section</h3>
        <div>
          <label className="block text-sm font-medium mb-2">Hero Title</label>
          <input
            name="hero_title"
            value={formData.hero_title}
            onChange={handleChange}
            className="input-base"
            placeholder="e.g. CNC Design & Custom Woodworking"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Hero Description</label>
          <textarea
            name="hero_description"
            value={formData.hero_description}
            onChange={handleChange}
            className="input-base resize-none"
            rows={3}
            placeholder="Enter hero section description..."
          />
        </div>
      </div>

      {/* About */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#F59E0B]">About Section</h3>
        <div>
          <label className="block text-sm font-medium mb-2">About Content</label>
          <textarea
            name="about_content"
            value={formData.about_content}
            onChange={handleChange}
            className="input-base resize-none"
            rows={5}
            placeholder="Tell your professional story..."
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#F59E0B]">Contact Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
              className="input-base"
              placeholder="e.g. ibrahimyt1711@gmail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              className="input-base"
              placeholder="e.g. +20 106 603 8136"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <input
            name="contact_address"
            value={formData.contact_address}
            onChange={handleChange}
            className="input-base"
            placeholder="e.g. Nasr City, Cairo, Egypt"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#F59E0B]">Social Links</h3>
        <div>
          <label className="block text-sm font-medium mb-2">Facebook URL</label>
          <input
            name="facebook_url"
            value={formData.facebook_url}
            onChange={handleChange}
            className="input-base"
            placeholder="https://facebook.com/username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
          <input
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleChange}
            className="input-base"
            placeholder="https://linkedin.com/in/username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Instagram URL</label>
          <input
            name="instagram_url"
            value={formData.instagram_url}
            onChange={handleChange}
            className="input-base"
            placeholder="https://instagram.com/username"
          />
        </div>
      </div>

      {/* SEO Settings */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#F59E0B]">SEO Defaults</h3>
        <div>
          <label className="block text-sm font-medium mb-2">Default SEO Title</label>
          <input
            name="seo_title"
            value={formData.seo_title}
            onChange={handleChange}
            className="input-base"
            placeholder="Default website SEO title..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Default SEO Description</label>
          <textarea
            name="seo_description"
            value={formData.seo_description}
            onChange={handleChange}
            className="input-base resize-none"
            rows={2}
            placeholder="Default website SEO description..."
          />
        </div>
      </div>
    </form>
  );
}
