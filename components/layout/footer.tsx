"use client";

export default function Footer() {
  return (
    <footer className="py-8 text-center border-t border-border bg-muted/10">
      <p className="text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Ibrahim Younes Abdelaziz. Engineered with precision.
      </p>
    </footer>
  );
}
