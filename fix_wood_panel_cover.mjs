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

async function fixWoodPanelCover() {
  try {
    const correctCoverUrl = "https://qwznevdakjcylosajrxj.supabase.co/storage/v1/object/public/portfolio/categories/decorative-wood-panel-series/wood-panel-1-00c1997d.webp";
    const projectSlug = "decorative-wood-panel-series";

    console.log(`Setting correct cover image for "${projectSlug}" to: ${correctCoverUrl}`);
    
    const { error: updateErr } = await supabase
      .from("projects")
      .update({ cover_image: correctCoverUrl })
      .eq("slug", projectSlug);

    if (updateErr) {
      console.error("Failed to update project cover:", updateErr);
    } else {
      console.log("Successfully set correct cover image!");
    }
  } catch (err) {
    console.error("Error occurred:", err);
  }
}

fixWoodPanelCover();
