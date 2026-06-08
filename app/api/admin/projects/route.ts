import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase-server";
import { projectSchema } from "@/lib/validators";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const secret = process.env.ADMIN_SECRET_TOKEN;
  return !!(session && secret && session === secret);
}

// GET /api/admin/projects - Get all projects (including drafts/archived) for admin list
export async function GET() {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data: projects, error } = await supabase
      .from("projects")
      .select(`
        *,
        category:categories(name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admin projects:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { technologies, materials, gallery, ...projectData } = body;

    // Validate main project data
    const parsed = projectSchema.safeParse(projectData);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid project data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Insert project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        ...parsed.data,
      })
      .select()
      .single();

    if (projectError || !project) {
      console.error("Error creating project:", projectError);
      return NextResponse.json({ error: projectError?.message || "Failed to create project" }, { status: 500 });
    }

    const projectId = project.id;

    // Insert technologies if provided
    if (Array.isArray(technologies) && technologies.length > 0) {
      const techInserts = technologies.map((tech) => ({
        project_id: projectId,
        technology_name: tech,
      }));
      const { error: techError } = await supabase.from("technologies").insert(techInserts);
      if (techError) console.error("Error inserting technologies:", techError);
    }

    // Insert materials if provided
    if (Array.isArray(materials) && materials.length > 0) {
      const matInserts = materials.map((mat) => ({
        project_id: projectId,
        material_name: mat,
      }));
      const { error: matError } = await supabase.from("materials").insert(matInserts);
      if (matError) console.error("Error inserting materials:", matError);
    }

    // Insert gallery media if provided
    if (Array.isArray(gallery) && gallery.length > 0) {
      const mediaInserts = gallery.map((item: any, index: number) => ({
        project_id: projectId,
        media_type: item.media_type || "image",
        file_url: item.file_url,
        caption: item.caption || null,
        sort_order: index,
      }));
      const { error: mediaError } = await supabase.from("project_media").insert(mediaInserts);
      if (mediaError) console.error("Error inserting gallery:", mediaError);
    }

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
