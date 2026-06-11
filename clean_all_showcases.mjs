import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const envPath = path.resolve(".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    env[match[1]] = (match[2] ? match[2].trim() : "").replace(/['"]/g, "");
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function cleanAllShowcases() {
  try {
    // 1. Delete showcase projects created recently
    const slugsToDelete = [
      "dressing-rooms-showcase",
      "kitchens-showcase",
      "furniture-showcase",
      "3d-design-collection"
    ];

    console.log("Deleting newly added showcase projects from database...");
    
    for (const slug of slugsToDelete) {
      // Get project ID first
      const { data: proj } = await supabase
        .from("projects")
        .select("id")
        .eq("slug", slug)
        .single();

      if (proj) {
        // Delete media linked to this project
        await supabase.from("project_media").delete().eq("project_id", proj.id);
        // Delete project
        const { error: delErr } = await supabase.from("projects").delete().eq("id", proj.id);
        if (delErr) {
          console.error(`Failed to delete project ${slug}:`, delErr);
        } else {
          console.log(`Deleted project ${slug} and its media successfully.`);
        }
      }
    }

    // 2. Restore 3D Design cover image to project5.png
    const originalProject5Img = "https://qwznevdakjcylosajrxj.supabase.co/storage/v1/object/public/portfolio/images/project5.png";
    const projectSlug = "3d-architectural-carvings";

    console.log(`Restoring original cover image for "${projectSlug}" to: ${originalProject5Img}`);
    await supabase
      .from("projects")
      .update({ cover_image: originalProject5Img })
      .eq("slug", projectSlug);

    console.log("Cleanup completed successfully!");

  } catch (err) {
    console.error("Error during cleanup:", err);
  }
}

cleanAllShowcases();
