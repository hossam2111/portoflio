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

async function checkAndRestore() {
  try {
    // 1. Fetch categories
    const { data: categories } = await supabase.from("categories").select("*");
    console.log("Database Categories:\n", JSON.stringify(categories, null, 2));

    // 2. Fetch projects
    const { data: projects } = await supabase.from("projects").select("id, title, slug, cover_image");
    console.log("\nDatabase Projects:\n", JSON.stringify(projects, null, 2));

    // 3. Restore the original cover image for 3D Architectural Carvings (project5)
    // The original cover image was project5.png: "https://qwznevdakjcylosajrxj.supabase.co/storage/v1/object/public/portfolio/images/project5.png"
    const originalProject5Img = "https://qwznevdakjcylosajrxj.supabase.co/storage/v1/object/public/portfolio/images/project5.png";
    const projectSlug = "3d-architectural-carvings";

    console.log(`\nRestoring original cover image for project: "${projectSlug}" to: ${originalProject5Img}`);
    const { error: updateErr } = await supabase
      .from("projects")
      .update({ cover_image: originalProject5Img })
      .eq("slug", projectSlug);

    if (updateErr) {
      console.error("Failed to restore original project image:", updateErr);
    } else {
      console.log("Original project cover image restored successfully!");
    }

  } catch (err) {
    console.error("Error occurred:", err);
  }
}

checkAndRestore();
