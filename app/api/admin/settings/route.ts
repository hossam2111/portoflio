import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase-server";
import { siteSettingsSchema } from "@/lib/validators";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const secret = process.env.ADMIN_SECRET_TOKEN;
  return !!(session && secret && session === secret);
}

// GET /api/admin/settings - Fetch homepage CMS settings
export async function GET() {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data: settings, error } = await supabase
      .from("site_settings")
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("Error fetching settings:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no settings exist yet, return empty object or default scaffold
    return NextResponse.json(settings || {});
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// PUT /api/admin/settings - Update homepage CMS settings
export async function PUT(request: NextRequest) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = siteSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid settings data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Check if a row exists
    const { data: existingSettings } = await supabase
      .from("site_settings")
      .select("id")
      .maybeSingle();

    let result;
    if (existingSettings?.id) {
      // Update existing
      const { data, error } = await supabase
        .from("site_settings")
        .update({
          ...parsed.data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSettings.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Insert new
      const { data, error } = await supabase
        .from("site_settings")
        .insert({
          ...parsed.data,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
