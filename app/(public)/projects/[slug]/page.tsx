import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import ProjectDetailClient from "./ProjectDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  try {
    const { slug } = await params;
    const supabase = createServerClient();
    const { data: project } = await supabase
      .from("projects")
      .select("title, seo_title, seo_description, description")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (!project) {
      return {
        title: "Project Not Found | Ibrahim Younes",
      };
    }

    return {
      title: project.seo_title || `${project.title} | Ibrahim Younes`,
      description: project.seo_description || project.description,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Project | Ibrahim Younes",
    };
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      *,
      category:categories(name),
      project_media(*),
      technologies(*),
      materials(*)
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !project) {
    console.error("Error fetching project:", error);
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
