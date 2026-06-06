import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase-server";
import { categorySchema } from "@/lib/validators";

async function verifyAdmin() {
  const { userId } = await auth();
  if (!userId) return false;

  const adminIds = process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || [];
  return adminIds.includes(userId);
}

// GET /api/admin/categories - Fetch all categories with dynamic project count
export async function GET() {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Fetch categories
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*, projects(id)")
      .order("name", { ascending: true });

    if (catError) {
      console.error("Error fetching categories:", catError);
      return NextResponse.json({ error: catError.message }, { status: 500 });
    }

    // Map project count
    const mapped = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      created_at: cat.created_at,
      count: cat.projects ? cat.projects.length : 0,
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid category data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: category, error } = await supabase
      .from("categories")
      .insert({
        name: parsed.data.name,
        slug: parsed.data.slug,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
