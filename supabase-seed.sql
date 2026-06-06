-- ═══════════════════════════════════════════════════════════════
-- Ibrahim Younes Engineering Portfolio — Seed Data
-- Run this AFTER the schema has been created
-- ═══════════════════════════════════════════════════════════════

-- ─── Categories ────────────────────────────────────────────────
INSERT INTO categories (name, slug) VALUES
  ('Dressing Rooms', 'dressing-rooms'),
  ('Kitchens', 'kitchens'),
  ('Woodworking', 'woodworking'),
  ('Decorative Panels', 'decorative-panels'),
  ('Furniture', 'furniture'),
  ('Acrylic', 'acrylic'),
  ('3D Design', '3d-design')
ON CONFLICT (slug) DO NOTHING;

-- ─── Site Settings ─────────────────────────────────────────────
INSERT INTO site_settings (
  hero_title,
  hero_description,
  about_content,
  contact_email,
  contact_phone,
  contact_address,
  seo_title,
  seo_description
) VALUES (
  'CNC Design & Custom Woodworking',
  'Transforming concepts into precision-crafted interiors, furniture, decorative panels, kitchens, dressing rooms, and custom manufacturing solutions using advanced CNC technology.',
  'With over 7 years of experience in CNC programming, CAD/CAM design, and woodworking, Ibrahim Younes delivers high-quality solutions for interior design, custom furniture, and decorative projects with precision and creativity. Combining technical expertise with creative design thinking to deliver exceptional results — from concept to final product, using ideas to life with attention to detail and commitment to quality.',
  'ibrahimyt1711@gmail.com',
  '+20 106 603 8136',
  'Nasr City, Cairo, Egypt',
  'Ibrahim Younes | CNC Design & Custom Woodworking',
  'Professional engineering portfolio showcasing CNC programming, CAD/CAM design, woodworking, interior design, custom furniture, and decorative panel projects.'
);

-- ─── Testimonials ──────────────────────────────────────────────
INSERT INTO testimonials (client_name, client_role, content, rating, featured) VALUES
(
  'Ahmed R.',
  'Interior Designer',
  'Ibrahim''s attention to detail and CNC expertise exceeded our expectations. The final result was beyond perfect.',
  5,
  true
),
(
  'Sarah M.',
  'Project Manager',
  'Professional, creative and extremely skilled. He transformed our ideas into reality with amazing finishing.',
  5,
  true
),
(
  'Omar K.',
  'Business Owner',
  'High-quality work, on-time delivery and great communication throughout the project.',
  5,
  true
);
