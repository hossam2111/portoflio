import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const MOCK_PROJECTS = [
  {
    id: "1",
    title: "Luxury Furniture Collection",
    slug: "luxury-furniture-collection",
    category: "Interior Design",
    tech: ["AutoCAD", "ArtCAM", "3ds Max"],
    image: "https://qwznevdakjcylosajrxj.supabase.co/storage/v1/object/public/portfolio/images/project1.png",
  },
  {
    id: "2",
    title: "Industrial Component Machining",
    slug: "industrial-component-machining",
    category: "CNC Programming",
    tech: ["Maestro", "EasyWOOD"],
    image: "https://qwznevdakjcylosajrxj.supabase.co/storage/v1/object/public/portfolio/images/project2.png",
  },
  {
    id: "3",
    title: "Decorative Wood Panel Series",
    slug: "decorative-wood-panel-series",
    category: "Interior Design",
    tech: ["ArtCAM", "Rhino"],
    image: "https://qwznevdakjcylosajrxj.supabase.co/storage/v1/object/public/portfolio/images/project3.png",
  },
  {
    id: "4",
    title: "CNC Router Optimization System",
    slug: "cnc-router-optimization-system",
    category: "Automation",
    tech: ["EasyWOOD", "Maestro"],
    image: "https://qwznevdakjcylosajrxj.supabase.co/storage/v1/object/public/portfolio/images/project4.png",
  },
  {
    id: "5",
    title: "3D Architectural Carvings",
    slug: "3d-architectural-carvings",
    category: "3D Design",
    tech: ["Rhino", "3ds Max", "ArtCAM"],
    image: "https://qwznevdakjcylosajrxj.supabase.co/storage/v1/object/public/portfolio/images/project5.png",
  },
  {
    id: "6",
    title: "Custom Toolpath Library",
    slug: "custom-toolpath-library",
    category: "CNC Programming",
    tech: ["ArtCAM", "AutoCAD"],
    image: "https://qwznevdakjcylosajrxj.supabase.co/storage/v1/object/public/portfolio/images/project6.png",
  }
];

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  tech: string[];
  image: string;
}

// الكاتجوريات الثابتة مع أيقوناتها — لا تتغير أبداً
const FIXED_CATEGORIES: { name: string; icon: React.ReactNode }[] = [
  {
    name: "All",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    name: "Interior Design",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    name: "CNC Programming",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        <path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
  },
  {
    name: "3D Design",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M12 2l10 6v8l-10 6L2 16V8z"/><path d="M12 22V10"/><path d="M22 8l-10 4L2 8"/>
      </svg>
    ),
  },
  {
    name: "Automation",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
  },
];

export function Projects() {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select(`
            id,
            title,
            slug,
            cover_image,
            category:categories(name),
            technologies(technology_name)
          `)
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped = data.map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            category: p.category?.name || "CNC Programming",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tech: p.technologies?.map((t: any) => t.technology_name) || [],
            image: p.cover_image || "https://qwznevdakjcylosajrxj.supabase.co/storage/v1/object/public/portfolio/images/project1.png"
          }));
          setProjects(mapped);
        } else {
          setProjects(MOCK_PROJECTS);
        }
      } catch (err) {
        console.error("Failed to fetch database projects, using mock:", err);
        setProjects(MOCK_PROJECTS);
      }
    }
    loadProjects();
  }, []);

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-primary"></span>
              Featured Projects
            </h2>
            <p className="text-muted-foreground max-w-xl">
              A selection of precision manufacturing and design projects showcasing expertise across different CAD/CAM disciplines.
            </p>
          </div>

          {/* الكاتجوريات الثابتة — لا تتغير أبداً */}
          <div className="flex flex-wrap gap-2">
            {FIXED_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setFilter(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === cat.name 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground hover:bg-primary/20"
                }`}
                data-testid={`filter-${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/projects/${project.slug}`} className="block h-full cursor-pointer group">
                  <Card className="overflow-hidden h-full bg-card hover:border-primary/50 transition-colors border-border group flex flex-col">
                    <div className="relative overflow-hidden aspect-video">
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                    </div>
                    <CardHeader className="pb-3 flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs font-normal border-primary/30 text-primary flex items-center gap-1">
                          {FIXED_CATEGORIES.find(c => c.name === project.category)?.icon}
                          {project.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.tech.map((t: string, i: number) => (
                           <span key={i} className="text-xs text-muted-foreground bg-accent/10 px-2 py-1 rounded">
                             {t}
                           </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}