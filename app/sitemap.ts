import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticPages = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.7 },
  ];

  // In production, fetch project slugs from Supabase
  // const { data: projects } = await supabase.from('projects').select('slug, updated_at').eq('status', 'published');
  // const projectPages = projects?.map(p => ({
  //   url: `${baseUrl}/projects/${p.slug}`,
  //   lastModified: new Date(p.updated_at),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.7,
  // })) || [];

  return [...staticPages];
}
