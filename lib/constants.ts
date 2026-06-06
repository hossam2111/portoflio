import {
  Cpu,
  PenTool,
  Home,
  Armchair,
  Grid3X3,
  Sparkles,
  Hammer,
  Box,
  Wrench,
  MessageSquare,
  Users,
  type LucideIcon,
} from "lucide-react";

// ─── Navigation ────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Featured Work", href: "/portfolio" },
  { label: "About Me", href: "/about" },
  { label: "Areas of Expertise", href: "/services" },
  { label: "Contact Me", href: "/contact" },
] as const;

// ─── Services / Areas of Expertise ─────────────────────────────
export interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const SERVICES: ServiceItem[] = [
  {
    title: "CNC Programming",
    description:
      "Advanced toolpath generation (G-code) and machine execution using Maestro and EasyWOOD for multi-axis routers.",
    icon: Cpu,
  },
  {
    title: "CAD/CAM Design",
    description:
      "Transforming complex design sketches, drawings, and concepts into production-ready 2D & 3D files.",
    icon: PenTool,
  },
  {
    title: "Rhino Modeling",
    description:
      "Developing precise 3D surface and solid models optimized for custom wood carvings and interior elements.",
    icon: Box,
  },
  {
    title: "Woodworking",
    description:
      "Hands-on execution of premium wood carvings, joinery, assembly, and custom panel fabrication.",
    icon: Hammer,
  },
  {
    title: "Interior Fabrication",
    description:
      "Designing and manufacturing luxury custom interiors, including walk-in closets, kitchen cabinetry, and TV units.",
    icon: Home,
  },
  {
    title: "Furniture Design",
    description:
      "Creating functional, ergonomic, and aesthetic furniture layouts tailored to client specifications and materials.",
    icon: Armchair,
  },
  {
    title: "CNC Machine Maintenance",
    description:
      "Calibrating mechanical parts, sensor alignment, vacuum table repair, and spindle maintenance to ensure precision.",
    icon: Wrench,
  },
  {
    title: "Workflow Optimization",
    description:
      "Nesting optimization, toolpath sequencing, and operator protocols to minimize material waste and setup time.",
    icon: Sparkles,
  },
];

// ─── Featured Expertise ────────────────────────────────────────
export const FEATURED_EXPERTISE = [
  {
    title: "CNC Programming",
    description:
      "Advanced CNC programming for wood, acrylic, and composite materials using industry-leading software. Precision machining with tolerances down to 0.1mm.",
    icon: Cpu,
  },
  {
    title: "CAD/CAM Design",
    description:
      "Full-spectrum digital design from concept to production-ready files. Expert in AutoCAD, ArtCAM, Rhino, and 3ds Max for complex geometries.",
    icon: PenTool,
  },
  {
    title: "Woodworking & Joinery",
    description:
      "Integrating high-quality woodworking with modern CNC routing technology for custom premium custom furniture and wood carvings.",
    icon: Hammer,
  },
  {
    title: "Custom Furniture Design",
    description:
      "Bespoke designs for luxury dressing rooms, kitchens, TV units, and custom retail panels using ArtCAM, Rhino, and AutoCAD.",
    icon: Armchair,
  },
  {
    title: "CNC Maintenance & Calibration",
    description:
      "Ensuring high precision and zero machine downtime through regular router calibration, hardware maintenance, and troubleshooting.",
    icon: Wrench,
  },
  {
    title: "Team Training & Mentorship",
    description:
      "Trained and mentored junior CNC operators and designers on programming, machine setup, safety protocols, and workflow optimization.",
    icon: Users,
  },
];

// ─── Technical Skills ──────────────────────────────────────────
export interface SkillItem {
  name: string;
  percentage: number;
}

export const TECHNICAL_SKILLS: SkillItem[] = [
  { name: "AutoCAD (2D & 3D)", percentage: 95 },
  { name: "ArtCAM (Toolpath Programming)", percentage: 90 },
  { name: "Maestro & EasyWOOD (CNC)", percentage: 90 },
  { name: "Rhino (3D Modeling & CNC Prep)", percentage: 85 },
  { name: "3ds Max (Visualization)", percentage: 85 },
  { name: "CNC Router Maintenance & Calibration", percentage: 85 },
  { name: "Team Training & Workflow Optimization", percentage: 85 },
];

export const SOFT_SKILLS = [
  "Leadership",
  "Public Speaking",
  "Communication Skill",
  "Presentation Skills",
  "Resilience",
  "Multitasking",
  "Self-Learning",
  "Team and Individual worker",
];

// ─── Languages ─────────────────────────────────────────────────
export const LANGUAGES = [
  { name: "Arabic", level: "Native" },
  { name: "English", level: "Professional" },
  { name: "German", level: "Intermediate" },
];

// ─── Education ─────────────────────────────────────────────────
export const EDUCATION = {
  degree: "Bachelor's Degree in Law and Sharia",
  university: "Faculty of Sharia and Law, Al Azhar University, Cairo, Egypt",
  gpa: "3.2",
  note: "While my formal education is in Law, my passion led me to master engineering design and precision manufacturing, demonstrating strong self-learning and analytical capabilities.",
};

// ─── Experience ────────────────────────────────────────────────
export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  startDate: string;
  endDate: string;
  location: string;
  responsibilities: string[];
  achievements: string[];
  tools: string[];
  impact: string;
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    title: "Senior CNC Programmer & Operator",
    company: "Aikon for Industry",
    period: "Feb 2018 - Present",
    startDate: "Feb 2018",
    endDate: "Present",
    location: "Cairo, Egypt",
    responsibilities: [
      "Program and execute complex 3-axis and 4-axis wood routers using Maestro and EasyWOOD software.",
      "Develop optimized CAD/CAM toolpaths from detailed 2D drawings and high-fidelity 3D modeling files.",
      "Supervise machinery operations, perform routing runs, calibrate coordinate offsets, and configure tools.",
      "Troubleshoot and fix mechanical, electrical, and software issues, maintaining regular servicing protocols.",
      "Train and mentor junior CNC operators on safety protocols, coordinates configuration, and routing parameters."
    ],
    achievements: [
      "Optimized toolpath routing parameters and nesting patterns, reducing raw wood/acrylic material waste by 15%.",
      "Reduced overall machining cycle execution time by 20% through efficient toolpath design and sequencing.",
      "Achieved and sustained a 98% machine uptime rating over 5 years via proactive calibration and sensor repairs.",
      "Successfully delivered custom high-end dressing rooms, kitchens, and architectural screens for 150+ custom projects."
    ],
    tools: ["Maestro", "EasyWOOD", "AutoCAD", "ArtCAM", "Rhino", "3ds Max"],
    impact: "Significantly enhanced workshop output capacity and carving accuracy, establishing Aikon as a top-tier supplier of bespoke custom interiors."
  },
  {
    title: "CNC Operator & Designer",
    company: "Al-Fanar Wood Industries",
    period: "Jan 2015 - March 2017",
    startDate: "Jan 2015",
    endDate: "March 2017",
    location: "Cairo, Egypt",
    responsibilities: [
      "Operated CNC wood routing machinery to fabricate detailed furniture parts and decorative screen panels.",
      "Created design files and output clean toolpath designs using ArtCAM and AutoCAD software.",
      "Configured coordinates offsets, set zero datum values, and selected appropriate router bits for wood materials.",
      "Carried out routine system upkeep, cleaned filters, serviced vacuum beds, and calibrated router rails."
    ],
    achievements: [
      "Boosted daily production speed of standard decorative screen panels by 10% by creating standardized vector templates.",
      "Successfully troubleshot and resolved complex double-sided panel carving alignment errors, reducing rework rates by 10%."
    ],
    tools: ["ArtCAM", "AutoCAD", "Rhino"],
    impact: "Improved engraving precision and routing consistency, ensuring zero client rejections on custom wood carving runs."
  },
];

// ─── Statistics ────────────────────────────────────────────────
export const STATISTICS = [
  { value: "7+", label: "Years Experience", icon: "calendar" },
  { value: "150+", label: "Projects Completed", icon: "briefcase" },
  { value: "98%", label: "CNC Machine Uptime", icon: "award" },
  { value: "5+", label: "Operators Trained", icon: "users" },
];

// ─── Contact Info ──────────────────────────────────────────────
export const CONTACT_INFO = {
  phone: ["+20 106 603 8136", "+20 111 587 0973"],
  email: "ibrahimyo1311@gmail.com",
  address: "Nasr City, Cairo, Egypt",
  social: {
    facebook: "#",
    linkedin: "#",
    instagram: "#",
  },
};

// ─── Portfolio Categories ──────────────────────────────────────
export const PORTFOLIO_CATEGORIES = [
  "All",
  "Dressing Rooms",
  "Kitchens",
  "Woodworking",
  "Decorative Panels",
  "Furniture",
  "Acrylic",
  "3D Design",
];

// ─── Admin Sidebar Links ───────────────────────────────────────
export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", href: "/admin", icon: "layout-dashboard" },
  { label: "Projects", href: "/admin/projects", icon: "folder-open" },
  { label: "Categories", href: "/admin/categories", icon: "tags" },
  { label: "Media Library", href: "/admin/media", icon: "image" },
  { label: "Messages", href: "/admin/messages", icon: "mail" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];
