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

async function cleanDuplicate() {
  try {
    const { error: delErr } = await supabase
      .from("projects")
      .delete()
      .eq("slug", "testprojectai");

    if (delErr) {
      console.error("Failed to delete duplicate Test Project AI:", delErr);
    } else {
      console.log("Successfully deleted duplicate Test Project AI!");
    }
  } catch (err) {
    console.error("Error occurred:", err);
  }
}

cleanDuplicate();
