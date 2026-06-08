import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase-server";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const secret = process.env.ADMIN_SECRET_TOKEN;
  return !!(session && secret && session === secret);
}

// GET /api/admin/messages - Fetch all contact messages for admin dashboard
export async function GET() {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
