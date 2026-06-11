import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const envPath = path.resolve(".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
  if (match) {
    env[match[1]] = (match[2] ? match[2].trim() : "").replace(/['"]/g, "");
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log("Checking and adding cover_image column to categories table...");

  // Check if column exists by trying to select it
  const { data, error } = await supabase
    .from("categories")
    .select("id, cover_image")
    .limit(1);

  if (!error) {
    console.log("✅ cover_image column already exists!");
    return;
  }

  if (error.message.includes("cover_image")) {
    console.log("Column does not exist. Cannot add via JS client.");
    console.log("\n⚠️  MANUAL STEP REQUIRED:");
    console.log("Go to: https://supabase.com/dashboard/project/qwznevdakjcylosajrxj/sql/new");
    console.log("Run this SQL:");
    console.log("ALTER TABLE categories ADD COLUMN IF NOT EXISTS cover_image TEXT;");
  } else {
    console.log("Unexpected error:", error.message);
  }
}

main();
