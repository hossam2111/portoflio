import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase-server";

async function verifyAdmin() {
  const { userId } = await auth();
  if (!userId) return false;

  const adminIds = process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || [];
  return adminIds.includes(userId);
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
