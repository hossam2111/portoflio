"use client";

import { About } from "@/components/portfolio/about";
import { Skills } from "@/components/portfolio/skills";

export default function AboutPage() {
  return (
    <div className="pt-20 bg-background text-foreground min-h-screen">
      <About />
      <Skills />
    </div>
  );
}
