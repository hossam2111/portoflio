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

async function listStorageAndMedia() {
  try {
    // 1. List files in portfolio bucket under images/
    const { data: files, error: storageErr } = await supabase.storage
      .from("portfolio")
      .list("images", { limit: 100 });

    if (storageErr) {
      console.error("Storage list error:", storageErr);
      return;
    }

    console.log("Found Storage Files:", files.length);
    const urls = files.map(f => `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/images/${f.name}`);
    
    // Group them by search/type tags
    const luxuryFurniture = urls.filter(u => u.includes("luxury-furniture"));
    const threeDDesign = urls.filter(u => u.includes("3d-design"));
    const others = urls.filter(u => !u.includes("luxury-furniture") && !u.includes("3d-design"));

    console.log(`Luxury Furniture URLs: ${luxuryFurniture.length}`);
    console.log(`3D Design URLs: ${threeDDesign.length}`);
    console.log(`Other URLs: ${others.length}`);

    // Print some URLs for reference
    console.log("Sample Others:\n", others.slice(0, 10));

  } catch (err) {
    console.error("Error occurred:", err);
  }
}

listStorageAndMedia();
