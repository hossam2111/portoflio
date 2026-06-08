import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase-server";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const secret = process.env.ADMIN_SECRET_TOKEN;
  return !!(session && secret && session === secret);
}

// GET /api/admin/media - List all files in the "portfolio" storage bucket
export async function GET() {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Ensure bucket exists (optional, wrap in try-catch for anon key support)
    try {
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      if (!bucketError && buckets) {
        const portfolioBucket = buckets.find((b) => b.name === "portfolio");
        if (!portfolioBucket) {
          await supabase.storage.createBucket("portfolio", { public: true });
        }
      }
    } catch (e) {
      console.warn("Bypassed listBuckets/createBucket check in GET:", e);
    }

    const { data: files, error } = await supabase.storage
      .from("portfolio")
      .list("", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("Error listing media files:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map files to public URLs
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const mappedFiles = files.map((file) => {
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/portfolio/${file.name}`;
      const sizeBytes = file.metadata?.size || 0;
      const mimeType = file.metadata?.mimetype || "";
      return {
        id: file.id,
        name: file.name,
        created_at: file.created_at,
        size: `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`,
        type: mimeType.startsWith("video/") ? "video" : "image",
        url: publicUrl,
      };
    });

    return NextResponse.json(mappedFiles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/media - Upload one or more files to Supabase Storage "portfolio" bucket
export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Ensure bucket exists (optional, wrap in try-catch for anon key support)
    try {
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      if (!bucketError && buckets) {
        const portfolioBucket = buckets.find((b) => b.name === "portfolio");
        if (!portfolioBucket) {
          await supabase.storage.createBucket("portfolio", { public: true });
        }
      }
    } catch (e) {
      console.warn("Bypassed listBuckets/createBucket check:", e);
    }

    const uploadedFiles = [];

    for (const file of files) {
      // Create a unique file name
      const fileExt = file.name.split(".").pop();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error } = await supabase.storage
        .from("portfolio")
        .upload(uniqueName, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        continue;
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/portfolio/${uniqueName}`;

      uploadedFiles.push({
        name: uniqueName,
        url: publicUrl,
        type: file.type.startsWith("video/") ? "video" : "image",
      });
    }

    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/media - Bulk delete files from Supabase Storage "portfolio" bucket
export async function DELETE(request: NextRequest) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileNames } = await request.json();

    if (!Array.isArray(fileNames) || fileNames.length === 0) {
      return NextResponse.json({ error: "No file names provided" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
      .from("portfolio")
      .remove(fileNames);

    if (error) {
      console.error("Error deleting files:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
