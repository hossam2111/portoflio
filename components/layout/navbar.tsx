"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Videos", href: "#videos" },
  { name: "Services", href: "#services" },
  { name: "Certificates", href: "#certificates" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a
          href={pathname === "/" ? "#home" : "/#home"}
          onClick={(e) => scrollToSection(e, "#home")}
          className="flex items-center"
          data-testid="link-home"
        >
          <div className="hover:opacity-85 transition-opacity flex items-center">
            <Image
              src="/logo.png"
              alt="Ibrahim Younes"
              width={160}
              height={160}
              className="h-12 md:h-14 w-auto object-contain"
              priority
            />
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const absoluteHref = pathname === "/" ? link.href : `/${link.href}`;
            return (
              <a
                key={link.name}
                href={absoluteHref}
                onClick={(e) => scrollToSection(e, link.href)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-md transition-colors"
                data-testid={`link-${link.name.toLowerCase()}`}
              >
                {link.name}
              </a>
            );
          })}
          <div className="pl-4 border-l border-border ml-2 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title="Toggle theme"
              data-testid="button-theme-toggle"
              className="rounded-full w-9 h-9"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-9 h-9"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            data-testid="button-mobile-menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-lg py-4 px-4 flex flex-col gap-2">
          {navLinks.map((link) => {
            const absoluteHref = pathname === "/" ? link.href : `/${link.href}`;
            return (
              <a
                key={link.name}
                href={absoluteHref}
                onClick={(e) => scrollToSection(e, link.href)}
                className="px-4 py-3 text-sm font-medium text-foreground bg-accent/5 hover:bg-accent/10 rounded-md transition-colors"
                data-testid={`mobile-link-${link.name.toLowerCase()}`}
              >
                {link.name}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
}
