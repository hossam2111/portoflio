"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Fixed YouTube Shorts — update IDs here when you upload more
const SHORTS = [
  {
    id: "uYGSp57wuR8",
    title: "زخرفة إسلامية ونقش خشب CNC",
    category: "اسلامى",
  },
  {
    id: "iVyjKBV4bXc",
    title: "تصميم وتصنيع درف مطابخ خشب CNC",
    category: "تصميم درف",
  },
  {
    id: "8JAO8gVX5gY",
    title: "تصنيع أبواب خشبية ودور كلوزر CNC",
    category: "ابواب",
  },
  {
    id: "xHpSphj5gYs",
    title: "تصميم طاولات ودوائر CNC",
    category: "طاولات",
  },
];

const CATEGORIES = ["الكل", ...Array.from(new Set(SHORTS.map((s) => s.category)))];

export function VideoShorts() {
  const [activeCategory, setActiveCategory] = useState("الكل");

  const filtered =
    activeCategory === "الكل"
      ? SHORTS
      : SHORTS.filter((s) => s.category === activeCategory);

  return (
    <section id="videos" className="py-24 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-primary"></span>
            فيديوهات الأعمال
          </h2>
          <p className="text-muted-foreground max-w-xl">
            مقاطع قصيرة تعرض أبرز أعمال الراوتر CNC — تصميم، نقش، وتصنيع.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col gap-2"
            >
              {/* 9:16 Shorts aspect ratio */}
              <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card"
                   style={{ paddingTop: "177.78%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <p className="text-sm font-medium text-foreground text-right leading-snug px-1">
                {video.title}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Link to channel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <a
            href="https://www.youtube.com/@ibrahimcnc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            شاهد المزيد على يوتيوب
          </a>
        </motion.div>
      </div>
    </section>
  );
}
