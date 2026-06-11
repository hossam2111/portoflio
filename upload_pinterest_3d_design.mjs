import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

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

const categorySlug = "3d-design"; // 3D Design
const projectSlug = "3d-design-collection";
const projectTitle = "3D Design & Modeling Collection";
const projectDescription = "A collection of premium 3D models and conceptual designs representing advanced geometric shapes, architectural structures, and custom CNC carving patterns.";

const pinterestLinks = [
  "https://pin.it/5HMycEe5L",
  "https://pin.it/5fTVcVdhD",
  "https://pin.it/65Vdvjzzw",
  "https://pin.it/4HmjQgqXf",
  "https://pin.it/27pwmllrA",
  "https://pin.it/3spJpl51i",
  "https://pin.it/2ZKH5medX",
  "https://pin.it/2qvVz4Gnz",
  "https://pin.it/3BWTPwSeO",
  "https://pin.it/66exSvaLv",
  "https://pin.it/7LDyiM78v",
  "https://pin.it/6Qy2Eupwr",
  "https://pin.it/4I35Cg6ob",
  "https://pin.it/1SWG2LicJ",
  "https://pin.it/7x1WnQima",
  "https://pin.it/4Ho24e9wp",
  "https://pin.it/2EV4h7v9m"
];

async function resolvePinterestImage(url) {
  try {
    const headRes = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      redirect: "follow"
    });
    
    const targetUrl = headRes.url;
    const pinMatch = targetUrl.match(/\/pin\/(\d+)/);
    if (!pinMatch) {
      throw new Error(`Could not parse Pin ID from redirected URL: ${targetUrl}`);
    }
    const cleanPinUrl = `https://www.pinterest.com/pin/${pinMatch[1]}/`;

    const oembedUrl = `https://www.pinterest.com/oembed.json?url=${encodeURIComponent(cleanPinUrl)}`;
    const oembedRes = await fetch(oembedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      }
    });

    if (!oembedRes.ok) {
      throw new Error(`oEmbed failed with status: ${oembedRes.status}`);
    }

    const data = await oembedRes.json();
    const imgUrl = data.thumbnail_url;
    
    if (imgUrl) {
      let fallbackUrl = imgUrl;
      let originalUrl = imgUrl;
      if (imgUrl.includes("/236x/")) {
        originalUrl = imgUrl.replace("/236x/", "/originals/");
      } else if (imgUrl.includes("/736x/")) {
        originalUrl = imgUrl.replace("/736x/", "/originals/");
      } else if (imgUrl.includes("/474x/")) {
        originalUrl = imgUrl.replace("/474x/", "/originals/");
      }
      return { originalUrl, fallbackUrl };
    }
    return null;
  } catch (error) {
    console.error(`Error resolving Pinterest url ${url}:`, error.message);
    return null;
  }
}

async function uploadImageToSupabase(urls, filename) {
  try {
    let res = await fetch(urls.originalUrl);
    let selectedUrl = urls.originalUrl;
    if (!res.ok) {
      console.warn(`Original URL failed to fetch (${res.status}), trying fallback: ${urls.fallbackUrl}`);
      res = await fetch(urls.fallbackUrl);
      selectedUrl = urls.fallbackUrl;
    }
    if (!res.ok) throw new Error(`Failed to fetch image from both original and fallback URLs`);
    const buffer = Buffer.from(await res.arrayBuffer());

    const { data, error } = await supabase.storage
      .from("portfolio")
      .upload(`images/${filename}`, buffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) throw error;
    
    const publicUrl = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/images/${filename}`;
    return publicUrl;
  } catch (error) {
    console.error(`Error uploading image to Supabase:`, error.message);
    return null;
  }
}

async function startImport() {
  console.log("Starting import for 3D Design Collection...");

  // 1. Get or create Category
  let categoryId = null;
  const { data: categoryData, error: catError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (catError || !categoryData) {
    console.log(`Category "${categorySlug}" not found, creating it...`);
    const { data: newCat, error: createCatError } = await supabase
      .from("categories")
      .insert({ name: "3D Design", slug: categorySlug })
      .select()
      .single();

    if (createCatError) {
      console.error("Failed to create category:", createCatError);
      process.exit(1);
    }
    categoryId = newCat.id;
  } else {
    categoryId = categoryData.id;
  }
  console.log(`Using Category ID: ${categoryId}`);

  // 2. Get or create Project
  let projectId = null;
  const { data: projectData, error: projError } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", projectSlug)
    .single();

  if (projError || !projectData) {
    console.log(`Project "${projectTitle}" not found, creating it...`);
    const { data: newProj, error: createProjError } = await supabase
      .from("projects")
      .insert({
        title: projectTitle,
        slug: projectSlug,
        description: projectDescription,
        category_id: categoryId,
        status: "published",
        featured: true,
      })
      .select()
      .single();

    if (createProjError) {
      console.error("Failed to create project:", createProjError);
      process.exit(1);
    }
    projectId = newProj.id;
  } else {
    projectId = projectData.id;
  }
  console.log(`Using Project ID: ${projectId}`);

  // 3. Process Pinterest Links
  console.log(`Processing ${pinterestLinks.length} Pinterest links...`);
  const uploadedUrls = [];

  for (let i = 0; i < pinterestLinks.length; i++) {
    const link = pinterestLinks[i];
    console.log(`[${i + 1}/${pinterestLinks.length}] Resolving ${link}...`);
    
    const urls = await resolvePinterestImage(link);
    if (!urls) {
      console.warn(`Could not resolve image for link: ${link}`);
      continue;
    }

    console.log(`Downloading and uploading image from: ${urls.originalUrl}`);
    const hash = crypto.createHash("md5").update(link).digest("hex");
    const filename = `3d-design-${hash}.png`;
    const publicUrl = await uploadImageToSupabase(urls, filename);

    if (publicUrl) {
      console.log(`Success! Public URL: ${publicUrl}`);
      uploadedUrls.push(publicUrl);
    }
    
    await new Promise((r) => setTimeout(r, 1000));
  }

  if (uploadedUrls.length === 0) {
    console.log("No images uploaded successfully.");
    return;
  }

  // 4. Update Cover Image of the project
  const coverImage = uploadedUrls[0];
  console.log(`Updating cover image for project to: ${coverImage}`);
  const { error: coverUpdateError } = await supabase
    .from("projects")
    .update({ cover_image: coverImage })
    .eq("id", projectId);

  if (coverUpdateError) {
    console.error("Failed to update project cover image:", coverUpdateError);
  }

  // 5. Insert project media gallery
  console.log("Inserting images into project_media...");
  const mediaObjects = uploadedUrls.map((url, index) => ({
    project_id: projectId,
    media_type: "image",
    file_url: url,
    caption: `${projectTitle} Detail #${index + 1}`,
    sort_order: index,
  }));

  await supabase.from("project_media").delete().eq("project_id", projectId);

  const { error: mediaInsertError } = await supabase
    .from("project_media")
    .insert(mediaObjects);

  if (mediaInsertError) {
    console.error("Failed to insert project media:", mediaInsertError);
  } else {
    console.log(`Successfully imported ${uploadedUrls.length} images for "${projectTitle}"!`);
  }
}

startImport();
