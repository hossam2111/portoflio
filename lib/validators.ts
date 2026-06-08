import { z } from "zod";

// ─── Contact Form ──────────────────────────────────────────────
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[+]?[\d\s()-]{7,20}$/.test(val),
      "Please enter a valid phone number"
    ),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ─── Project Form ──────────────────────────────────────────────
export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().min(10, "Description is required"),
  challenge: z.string().nullable().optional(),
  solution: z.string().nullable().optional(),
  process: z.string().nullable().optional(),
  results: z.string().nullable().optional(),
  category_id: z.string().uuid("Please select a category"),
  cover_image: z.string().url("Cover image URL is required"),
  client_name: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  completion_date: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
  before_image: z.string().url().nullable().optional().or(z.literal("")),
  after_image: z.string().url().nullable().optional().or(z.literal("")),
  technical_specs: z.string().nullable().optional(),
  youtube_url: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => !val || /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(val),
      "Please enter a valid YouTube URL"
    ),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// ─── Category Form ─────────────────────────────────────────────
export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().min(2, "Slug is required"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// ─── Site Settings Form ────────────────────────────────────────
export const siteSettingsSchema = z.object({
  hero_title: z.string().optional(),
  hero_description: z.string().optional(),
  about_content: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  contact_address: z.string().optional(),
  facebook_url: z.string().url().optional().or(z.literal("")),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  instagram_url: z.string().url().optional().or(z.literal("")),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;

// ─── Message Status ────────────────────────────────────────────
export const messageStatusSchema = z.object({
  status: z.enum(["new", "read", "archived"]),
});
