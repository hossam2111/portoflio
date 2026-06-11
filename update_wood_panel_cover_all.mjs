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

async function updateCover() {
  try {
    const correctCoverUrl = "https://qwznevdakjcylosajrxj.supabase.co/storage/v1/object/public/portfolio/categories/decorative-wood-panel-series/wood-panel-25-78292d00.jpg";
    const slug = "decorative-wood-panel-series";

    console.log(`Setting project cover image for "${slug}" to: ${correctCoverUrl}`);
    const { error: projErr } = await supabase
      .from("projects")
      .update({ cover_image: correctCoverUrl })
      .eq("slug", slug);

    if (projErr) console.error("Error updating project cover:", projErr);
    else console.log("Successfully updated project cover!");

    console.log(`Setting category cover image for "${slug}" to: ${correctCoverUrl}`);
    const { error: catErr } = await supabase
      .from("categories")
      .update({ cover_image: correctCoverUrl })
      .eq("slug", slug);

    if (catErr) console.error("Error updating category cover:", catErr);
    else console.log("Successfully updated category cover!");

  } catch (err) {
    console.error(err);
  }
}

updateCover();
