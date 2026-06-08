"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  User,
  Tag,
  ChevronRight,
  Play,
  ArrowLeft,
} from "lucide-react";
import { cn, extractYouTubeId, getYouTubeEmbedUrl } from "@/lib/utils";

interface ProjectMedia {
  id: string;
  media_type: "image" | "video";
  file_url: string;
  caption?: string;
}

interface Technology {
  id: string;
  technology_name: string;
}

interface Material {
  id: string;
  material_name: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  challenge?: string;
  solution?: string;
  process?: string;
  results?: string;
  cover_image: string;
  client_name?: string;
  location?: string;
  duration?: string;
  completion_date?: string;
  before_image?: string;
  after_image?: string;
  technical_specs?: string;
  youtube_url?: string;
  category?: {
    name: string;
  };
  project_media?: ProjectMedia[];
  technologies?: Technology[];
  materials?: Material[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ProjectDetailClient({ project }: { project: Project }) {
  const [activeTab, setActiveTab] = useState("Overview");

  // Filter tabs dynamically based on available content
  const tabs = ["Overview"];
  if (project.challenge) tabs.push("Challenge");
  if (project.solution) tabs.push("Solution");
  if (project.process) tabs.push("Process");
  if (project.project_media && project.project_media.length > 0) tabs.push("Gallery");
  if (project.youtube_url) tabs.push("Video");
  if (project.technologies && project.technologies.length > 0) tabs.push("Technologies");
  if (project.materials && project.materials.length > 0) tabs.push("Materials");
  if (project.results) tabs.push("Results");

  const formattedDate = project.completion_date
    ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(
        new Date(project.completion_date)
      )
    : undefined;

  const youtubeVideoId = project.youtube_url ? extractYouTubeId(project.youtube_url) : null;
  const youtubeEmbedUrl = youtubeVideoId ? getYouTubeEmbedUrl(youtubeVideoId) : null;

  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-4 bg-blueprint-subtle">
        <div className="container-custom">
          <div className="text-sm text-[#64748B] mb-6">
            <Link href="/" className="hover:text-[#F59E0B] transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/portfolio" className="hover:text-[#F59E0B] transition-colors">Projects</Link>
            <span className="mx-2">›</span>
            <span className="text-[#F1F5F9]">{project.title}</span>
          </div>

          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#F59E0B] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
        </div>
      </section>

      {/* Hero */}
      <section className="py-8">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h1
              variants={fadeUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            >
              {project.title}
            </motion.h1>

            {/* Metadata */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-4 mb-8"
            >
              {project.category?.name && (
                <span className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Tag className="w-4 h-4 text-[#F59E0B]" />
                  {project.category.name}
                </span>
              )}
              {project.client_name && (
                <span className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <User className="w-4 h-4 text-[#F59E0B]" />
                  {project.client_name}
                </span>
              )}
              {project.duration && (
                <span className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Clock className="w-4 h-4 text-[#F59E0B]" />
                  {project.duration}
                </span>
              )}
              {project.location && (
                <span className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <MapPin className="w-4 h-4 text-[#F59E0B]" />
                  {project.location}
                </span>
              )}
              {formattedDate && (
                <span className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Calendar className="w-4 h-4 text-[#F59E0B]" />
                  {formattedDate}
                </span>
              )}
            </motion.div>

            {/* Cover Image */}
            <motion.div
              variants={fadeUp}
              className="relative aspect-[16/7] rounded-2xl overflow-hidden border border-[#1E293B] bg-gradient-to-br from-[#101722] to-[#0E141D]"
            >
              {project.cover_image ? (
                <img
                  src={project.cover_image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#64748B]">No Cover Image</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-[#1E293B] z-30 bg-[#05070A]">
        <div className="container-custom">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all",
                  activeTab === tab
                    ? "bg-[#F59E0B] text-[#05070A]"
                    : "text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#101722]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="space-y-12">
            {/* Main Content */}
            <div className="w-full">
              {activeTab === "Overview" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
                    <p className="text-[#94A3B8] leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                  </div>

                  {/* Before / After Slider / Section if available */}
                  {(project.before_image || project.after_image) && (
                    <div className="pt-6 border-t border-[#1E293B]">
                      <h3 className="text-lg font-semibold mb-4">Transformation (Before / After)</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {project.before_image && (
                          <div className="space-y-2">
                            <p className="text-xs text-[#64748B] uppercase tracking-wider font-semibold">Before</p>
                            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#1E293B] bg-[#0E141D]">
                              <img
                                src={project.before_image}
                                alt="Before transformation"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        {project.after_image && (
                          <div className="space-y-2">
                            <p className="text-xs text-[#F59E0B] uppercase tracking-wider font-semibold font-mono">After</p>
                            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#1E293B] bg-[#0E141D]">
                              <img
                                src={project.after_image}
                                alt="After transformation"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "Challenge" && project.challenge && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-semibold mb-4">The Challenge</h2>
                  <p className="text-[#94A3B8] leading-relaxed whitespace-pre-line">{project.challenge}</p>
                </motion.div>
              )}

              {activeTab === "Solution" && project.solution && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-semibold mb-4">My Solution</h2>
                  <p className="text-[#94A3B8] leading-relaxed whitespace-pre-line">{project.solution}</p>
                </motion.div>
              )}

              {activeTab === "Process" && project.process && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-semibold mb-4">The Process</h2>
                  <div className="space-y-3">
                    {project.process.split("\n").map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-[#F59E0B]">{i + 1}</span>
                        </div>
                        <p className="text-sm text-[#94A3B8]">{step.replace(/^\d+\.\s*/, "")}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "Gallery" && project.project_media && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                  {(() => {
                    const imagesMedia = project.project_media.filter(m => m.media_type === "image");
                    const videosMedia = project.project_media.filter(m => m.media_type === "video");

                    return (
                      <>
                        {imagesMedia.length > 0 && (
                          <div>
                            <h2 className="text-xl font-semibold mb-6">Photos Gallery</h2>
                            <div className="grid grid-cols-2 gap-6">
                              {imagesMedia.map((media) => (
                                <div
                                  key={media.id}
                                  className="aspect-[4/3] rounded-xl border border-[#1E293B] bg-gradient-to-br from-[#101722] to-[#0E141D] overflow-hidden relative group"
                                >
                                  <img
                                    src={media.file_url}
                                    alt={media.caption || project.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                  {media.caption && (
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-sm text-[#F1F5F9]">
                                      {media.caption}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {videosMedia.length > 0 && (
                          <div>
                            <h2 className="text-xl font-semibold mb-6">Videos Gallery</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              {videosMedia.map((media) => (
                                <div
                                  key={media.id}
                                  className="aspect-video rounded-xl border border-[#1E293B] bg-black overflow-hidden relative"
                                >
                                  {(() => {
                                    const yId = extractYouTubeId(media.file_url);
                                    if (yId) {
                                      return (
                                        <iframe
                                          src={getYouTubeEmbedUrl(yId)}
                                          title={media.caption || "Gallery Video"}
                                          className="w-full h-full"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                        />
                                      );
                                    } else {
                                      return (
                                        <video
                                          src={media.file_url}
                                          controls
                                          className="w-full h-full object-cover"
                                        />
                                      );
                                    }
                                  })()}
                                  {media.caption && (
                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 p-3 text-xs text-[#94A3B8] pointer-events-none truncate">
                                      {media.caption}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </motion.div>
              )}

              {activeTab === "Video" && youtubeEmbedUrl && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-semibold mb-4">Project Showcase Video</h2>
                  <div className={
                    project.youtube_url?.includes('/shorts/') 
                      ? "aspect-[9/16] w-full max-w-sm mx-auto rounded-xl border border-[#1E293B] bg-black overflow-hidden shadow-2xl shadow-black/50"
                      : "aspect-video w-full rounded-xl border border-[#1E293B] bg-gradient-to-br from-[#101722] to-[#0E141D] overflow-hidden"
                  }>
                    <iframe
                      src={youtubeEmbedUrl}
                      title={`${project.title} Video Showcase`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === "Technologies" && project.technologies && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-semibold mb-4">Technologies Used</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <span
                        key={t.id}
                        className="px-4 py-2 text-sm bg-[#101722] border border-[#1E293B] rounded-lg text-[#F59E0B]"
                      >
                        {t.technology_name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "Materials" && project.materials && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-semibold mb-4">Materials Used</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.materials.map((m) => (
                      <span
                        key={m.id}
                        className="px-4 py-2 text-sm bg-[#101722] border border-[#1E293B] rounded-lg text-[#94A3B8]"
                      >
                        {m.material_name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "Results" && project.results && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-semibold mb-4">Results</h2>
                  <p className="text-[#94A3B8] leading-relaxed whitespace-pre-line">{project.results}</p>
                </motion.div>
              )}
            </div>

            {/* Project Details & Inquiry Section (Bottom Layout) */}
            <div className="border-t border-[#1E293B] pt-12 mt-12">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                
                {/* Left Column: Project Details and Technical Specifications */}
                <div className="glass-card p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-[#F59E0B] tracking-wide">
                      Project Details
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {project.category?.name && (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-[#64748B] uppercase tracking-wider font-semibold font-mono">Category</span>
                          <span className="text-sm font-medium">{project.category.name}</span>
                        </div>
                      )}
                      {project.client_name && (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-[#64748B] uppercase tracking-wider font-semibold font-mono">Client</span>
                          <span className="text-sm font-medium">{project.client_name}</span>
                        </div>
                      )}
                      {project.location && (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-[#64748B] uppercase tracking-wider font-semibold font-mono">Location</span>
                          <span className="text-sm font-medium">{project.location}</span>
                        </div>
                      )}
                      {project.duration && (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-[#64748B] uppercase tracking-wider font-semibold font-mono">Duration</span>
                          <span className="text-sm font-medium">{project.duration}</span>
                        </div>
                      )}
                      {formattedDate && (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-[#64748B] uppercase tracking-wider font-semibold font-mono">Completion</span>
                          <span className="text-sm font-medium">{formattedDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {project.technical_specs && (
                    <div className="border-t border-[#1E293B] pt-6">
                      <h4 className="text-sm font-semibold mb-3 text-[#F1F5F9]">
                        Technical Specifications
                      </h4>
                      <div className="text-xs text-[#94A3B8] space-y-1 font-mono whitespace-pre-line bg-[#05070A]/50 p-4 rounded-xl border border-[#1E293B]">
                        {project.technical_specs}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Inquiry Action */}
                <div className="glass-card p-8 flex flex-col justify-between h-full bg-gradient-to-br from-[#101722]/50 to-[#0E141D]/50 border border-[#1E293B] hover:border-[#F59E0B]/30 transition-all duration-300">
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-[#F59E0B]">
                      Interested in a similar project?
                    </h3>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">
                      If you're inspired by this project and would like to build something custom suited to your specifications, let's talk and explore the possibilities together.
                    </p>
                  </div>
                  <Link href="/contact" className="btn-primary w-full text-center py-3 text-sm font-semibold flex items-center justify-center transition-all duration-300 hover:scale-[1.02]">
                    Inquire About Similar Project
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
