import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase-server";
import { projectSchema } from "@/lib/validators";

async function verifyAdmin() {
  const { userId } = await auth();
  if (!userId) return false;

  const adminIds = process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || [];
  return adminIds.includes(userId);
}

// GET /api/admin/projects/[id] - Fetch a single project with details for editing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createAdminClient();

    const { data: project, error } = await supabase
      .from("projects")
      .select(`
        *,
        technologies(*),
        materials(*),
        project_media(*)
      `)
      .eq("id", id)
      .single();

    if (error || !project) {
      console.error("Error fetching project:", error);
      return NextResponse.json({ error: error?.message || "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// PUT /api/admin/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { technologies, materials, gallery, ...projectData } = body;

    // Validate project data
    const parsed = projectSchema.safeParse(projectData);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid project data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Update project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .update({
        ...parsed.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (projectError || !project) {
      console.error("Error updating project:", projectError);
      return NextResponse.json({ error: projectError?.message || "Failed to update project" }, { status: 500 });
    }

    // 2. Sync technologies (delete + insert)
    if (Array.isArray(technologies)) {
      const { error: deleteTechError } = await supabase
        .from("technologies")
        .delete()
        .eq("project_id", id);
      
      if (deleteTechError) console.error("Error deleting old technologies:", deleteTechError);

      if (technologies.length > 0) {
        const techInserts = technologies.map((tech) => ({
          project_id: id,
          technology_name: tech,
        }));
        const { error: techError } = await supabase.from("technologies").insert(techInserts);
        if (techError) console.error("Error inserting technologies:", techError);
      }
    }

    // 3. Sync materials (delete + insert)
    if (Array.isArray(materials)) {
      const { error: deleteMatError } = await supabase
        .from("materials")
        .delete()
        .eq("project_id", id);
      
      if (deleteMatError) console.error("Error deleting old materials:", deleteMatError);

      if (materials.length > 0) {
        const matInserts = materials.map((mat) => ({
          project_id: id,
          material_name: mat,
        }));
        const { error: matError } = await supabase.from("materials").insert(matInserts);
        if (matError) console.error("Error inserting materials:", matError);
      }
    }

    // 4. Sync gallery media (delete + insert)
    if (Array.isArray(gallery)) {
      const { error: deleteMediaError } = await supabase
        .from("project_media")
        .delete()
        .eq("project_id", id);
      
      if (deleteMediaError) console.error("Error deleting old gallery:", deleteMediaError);

      if (gallery.length > 0) {
        const mediaInserts = gallery.map((item: any, index: number) => ({
          project_id: id,
          media_type: "image",
          file_url: item.file_url,
          caption: item.caption || null,
          sort_order: index,
        }));
        const { error: mediaError } = await supabase.from("project_media").insert(mediaInserts);
        if (mediaError) console.error("Error inserting gallery:", mediaError);
      }
    }

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createAdminClient();

    // Cascades delete related technologies, materials, project_media
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error("Error deleting project:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
