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

async function fixLuxuryFurniture() {
  try {
    // 1. Restore the original beautiful project1.png cover for Luxury Furniture Collection
    const originalFurnitureImg = "https://qwznevdakjcylosajrxj.supabase.co/storage/v1/object/public/portfolio/images/project1.png";
    const furnitureSlug = "luxury-furniture-collection";

    console.log(`Restoring original cover image for "${furnitureSlug}" to: ${originalFurnitureImg}`);
    await supabase
      .from("projects")
      .update({ cover_image: originalFurnitureImg })
      .eq("slug", furnitureSlug);

    // 2. Delete the Video Embed Project (slug: video-embed-project)
    const { data: videoProj } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", "video-embed-project")
      .single();

    if (videoProj) {
      console.log("Deleting 'video-embed-project'...");
      // Delete media
      await supabase.from("project_media").delete().eq("project_id", videoProj.id);
      // Delete project
      const { error: delErr } = await supabase.from("projects").delete().eq("id", videoProj.id);
      if (delErr) {
        console.error("Failed to delete video project:", delErr);
      } else {
        console.log("Deleted 'video-embed-project' successfully.");
      }
    }

    console.log("Fix completed successfully!");

  } catch (err) {
    console.error("Error occurred:", err);
  }
}

fixLuxuryFurniture();
