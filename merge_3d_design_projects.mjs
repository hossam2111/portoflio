import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const envPath = path.resolve(".env.local");
if (!fs.existsSync(envPath)) {
  console.error(".env.local file not found in current directory!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    env[match[1]] = (match[2] ? match[2].trim() : "").replace(/['"]/g, "");
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function mergeProjects() {
  try {
    // 1. Find the target original project (e.g. 3d-architectural-carvings or similar)
    const { data: originalProjects, error: fetchErr } = await supabase
      .from("projects")
      .select("id, category_id, title, slug")
      .eq("slug", "3d-architectural-carvings")
      .single();

    if (fetchErr || !originalProjects) {
      console.error("Could not find the original 3D Design project '3d-architectural-carvings':", fetchErr);
      return;
    }

    const originalProjectId = originalProjects.id;
    console.log(`Original Project found: "${originalProjects.title}" with ID: ${originalProjectId}`);

    // 2. Find the temporary created project
    const { data: tempProject, error: tempErr } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", "3d-design-collection")
      .single();

    if (tempErr || !tempProject) {
      console.log("Temporary project '3d-design-collection' not found, maybe already cleaned.");
    } else {
      const tempProjectId = tempProject.id;
      console.log(`Temporary Project found with ID: ${tempProjectId}. Moving media to original project...`);

      // Get all media from temp project
      const { data: mediaItems, error: mediaErr } = await supabase
        .from("project_media")
        .select("*")
        .eq("project_id", tempProjectId);

      if (mediaErr) {
        console.error("Failed to fetch media from temp project:", mediaErr);
      } else if (mediaItems && mediaItems.length > 0) {
        // Change their project_id to the original project
        const updatedMedia = mediaItems.map(item => ({
          project_id: originalProjectId,
          media_type: item.media_type,
          file_url: item.file_url,
          caption: item.caption,
          sort_order: item.sort_order
        }));

        // Insert into original project media
        const { error: insertErr } = await supabase
          .from("project_media")
          .insert(updatedMedia);

        if (insertErr) {
          console.error("Failed to insert media into original project:", insertErr);
        } else {
          console.log(`Successfully merged ${updatedMedia.length} images into original project!`);
        }
      }

      // Delete the temporary project
      const { error: deleteProjErr } = await supabase
        .from("projects")
        .delete()
        .eq("id", tempProjectId);

      if (deleteProjErr) {
        console.error("Failed to delete temporary project:", deleteProjErr);
      } else {
        console.log("Deleted temporary project successfully!");
      }
    }

    // 3. Delete the temporary category if created
    const { data: tempCategory, error: tempCatErr } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", "3d-design")
      .single();

    if (tempCatErr || !tempCategory) {
      console.log("Temporary category '3d-design' not found, maybe already cleaned.");
    } else {
      // Ensure no other project is using it
      const { data: linkedProjects } = await supabase
        .from("projects")
        .select("id")
        .eq("category_id", tempCategory.id);

      if (!linkedProjects || linkedProjects.length === 0) {
        const { error: deleteCatErr } = await supabase
          .from("categories")
          .delete()
          .eq("id", tempCategory.id);

        if (deleteCatErr) {
          console.error("Failed to delete temporary category:", deleteCatErr);
        } else {
          console.log("Deleted temporary category '3d-design' successfully!");
        }
      } else {
        console.log(`Category '3d-design' has ${linkedProjects.length} linked projects, not deleting.`);
      }
    }

  } catch (err) {
    console.error("Error merging:", err);
  }
}

mergeProjects();
