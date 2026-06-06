"use client";

import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { Skills } from "@/components/portfolio/skills";
import { Experience } from "@/components/portfolio/experience";
import { Projects } from "@/components/portfolio/projects";
import { Services } from "@/components/portfolio/services";
import { Certificates } from "@/components/portfolio/certificates";
import { Contact } from "@/components/portfolio/contact";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Services />
      <Certificates />
      <Contact />
    </div>
  );
}
