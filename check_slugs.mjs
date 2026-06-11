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

async function checkSlugs() {
  try {
    const slug = "decorative-wood-panel-series";
    
    console.log("Checking project with slug:", slug);
    const { data: projects, error: projErr } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug);
      
    if (projErr) console.error("Proj error:", projErr);
    else console.log("Projects:", JSON.stringify(projects, null, 2));

    console.log("Checking category with slug:", slug);
    const { data: categories, error: catErr } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug);

    if (catErr) console.error("Cat error:", catErr);
    else console.log("Categories:", JSON.stringify(categories, null, 2));

  } catch (err) {
    console.error(err);
  }
}

checkSlugs();
