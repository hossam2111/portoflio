import { ClerkProvider } from "@clerk/nextjs";
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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ibrahim Younes Engineering",
    title: "Ibrahim Younes | CNC Design & Custom Woodworking",
    description:
      "Professional engineering portfolio showcasing CNC programming, CAD/CAM design, woodworking, and custom manufacturing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ibrahim Younes | CNC Design & Custom Woodworking",
    description:
      "Professional engineering portfolio showcasing CNC programming, CAD/CAM design, woodworking, and custom manufacturing.",
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
      <body className="min-h-screen bg-[#05070A] text-[#F1F5F9] antialiased">
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#F59E0B",
              colorBackground: "#0E141D",
              colorText: "#F1F5F9",
              colorInputBackground: "#101722",
              colorInputText: "#F1F5F9",
            },
          }}
        >
          {children}
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}