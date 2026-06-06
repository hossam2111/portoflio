import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const envPath = path.resolve('c:\\Users\\VIP\\Desktop\\portf\\.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    env[match[1]] = (match[2] ? match[2].trim() : '').replace(/['"]/g, '');
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function updateProject() {
  try {
    // 1. Fetch projects
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('id, title, slug, cover_image')
      .limit(1);

    if (fetchError || !projects || projects.length === 0) {
      console.log("No projects found in database to update.");
      return;
    }

    const project = projects[0];
    const newImageUrl = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/test-image.png`;

    console.log(`Updating project "${project.title}" (${project.id}) cover image to: ${newImageUrl}`);

    const { error: updateError } = await supabase
      .from('projects')
      .update({ cover_image: newImageUrl })
      .eq('id', project.id);

    if (updateError) {
      console.error("Failed to update project:", updateError);
    } else {
      console.log("Project updated successfully! Now check the homepage or portfolio page.");
    }
  } catch (err) {
    console.error("Error occurred:", err);
  }
}

updateProject();
