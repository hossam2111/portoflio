import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ibrahim Younes | CNC Design & Custom Woodworking",
    template: "%s | Ibrahim Younes Engineering",
  },
  description:
    "Professional engineering portfolio showcasing CNC programming, CAD/CAM design, woodworking, interior design, custom furniture, and decorative panel projects.",
  keywords: [
    "CNC Programming",
    "CAD/CAM Design",
    "Woodworking",
    "Custom Furniture",
    "Interior Design",
    "Decorative Panels",
    "Acrylic Works",
    "3D Modeling",
    "Cairo",
    "Egypt",
  ],
  authors: [{ name: "Ibrahim Younes" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ibrahim Younes Engineering",
    title: "Ibrahim Younes | CNC Design & Custom Woodworking",
    description:
      "Professional engineering portfolio showcasing CNC programming, CAD/CAM design, woodworking, and custom manufacturing.",
    images: [
      {
        url: "https://ibrahim.thefuture-makers.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ibrahim Younes - CNC Programmer & Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ibrahim Younes | CNC Design & Custom Woodworking",
    description:
      "Professional engineering portfolio showcasing CNC programming, CAD/CAM design, woodworking, and custom manufacturing.",
    images: ["https://ibrahim.thefuture-makers.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}