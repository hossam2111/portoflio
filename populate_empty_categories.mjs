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

// Sample clean, high-quality links relevant to CNC, woodworking, kitchens, dressing rooms, etc.
const CATEGORY_IMAGES = {
  "dressing-rooms": [
    "https://images.unsplash.com/photo-1558882224-cca166733360?q=80&w=600",
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600",
    "https://images.unsplash.com/photo-1597523927402-240a203b7b0a?q=80&w=600",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=600"
  ],
  "kitchens": [
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600",
    "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=600",
    "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=600",
    "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?q=80&w=600",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=600",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=600",
    "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=600",
    "https://images.unsplash.com/photo-1522050212171-61b01dd24579?q=80&w=600"
  ],
  "furniture": [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600",
    "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=600",
    "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=600",
    "https://images.unsplash.com/photo-1544030288-e6e6108867f8?q=80&w=600",
    "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=600",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600",
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=600",
    "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=600",
    "https://images.unsplash.com/photo-1506898667547-42e22a46e125?q=80&w=600"
  ]
};

async function populateCategories() {
  try {
    for (const [slug, images] of Object.entries(CATEGORY_IMAGES)) {
      // Find category in Database
      const { data: cat } = await supabase
        .from("categories")
        .select("id, name")
        .eq("slug", slug)
        .single();

      if (!cat) {
        console.log(`Category ${slug} not found in database.`);
        continue;
      }

      console.log(`Populating category: "${cat.name}" (${slug})`);

      // Create a main project for this category
      const projectSlug = `${slug}-showcase`;
      const projectTitle = `${cat.name} Showcase`;
      
      const { data: existingProject } = await supabase
        .from("projects")
        .select("id")
        .eq("slug", projectSlug)
        .single();

      let projectId;
      if (existingProject) {
        projectId = existingProject.id;
      } else {
        const { data: newProj, error: err } = await supabase
          .from("projects")
          .insert({
            title: projectTitle,
            slug: projectSlug,
            description: `A showcase collection displaying our premium work in ${cat.name} design and fabrication.`,
            category_id: cat.id,
            cover_image: images[0],
            status: "published",
            featured: true
          })
          .select()
          .single();
        
        if (err) {
          console.error(`Failed to create project for ${slug}:`, err);
          continue;
        }
        projectId = newProj.id;
      }

      // Populate media
      const mediaInserts = images.map((imgUrl, idx) => ({
        project_id: projectId,
        media_type: "image",
        file_url: imgUrl,
        caption: `${cat.name} Showcase Image #${idx + 1}`,
        sort_order: idx
      }));

      // Delete old media
      await supabase.from("project_media").delete().eq("project_id", projectId);

      // Insert new media
      const { error: mediaErr } = await supabase.from("project_media").insert(mediaInserts);
      if (mediaErr) {
        console.error(`Failed to insert media for ${slug}:`, mediaErr);
      } else {
        console.log(`Successfully populated ${images.length} images for "${cat.name}"!`);
      }
    }
  } catch (err) {
    console.error("Error occurred:", err);
  }
}

populateCategories();
