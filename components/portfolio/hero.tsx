import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowDown, Download, Layers } from "lucide-react";

export function Hero() {
  const scrollToProjects = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.querySelector("#projects");
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const scrollToContact = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.querySelector("#contact");
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Blueprint/Geometric Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{ 
               backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
               backgroundSize: '40px 40px' 
             }}>
        </div>
        <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full border border-primary/50"></div>
        <div className="absolute top-[40%] right-[15%] w-[20vw] h-[20vw] rotate-45 border border-primary/30"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="h-[1px] w-12 bg-primary"></div>
            <span className="text-primary font-mono text-sm tracking-wider uppercase">Senior CNC Programmer & Designer</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-6 text-foreground"
          >
            Ibrahim<br />
            <span className="text-muted-foreground">Younes</span><br />
            Abdelaziz
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
          >
            7 years of expertise turning engineering concepts into high-precision physical reality. Master craftsman in CAD/CAM design and industrial manufacturing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button 
              size="lg" 
              className="h-14 px-8 text-base group bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={scrollToProjects}
              data-testid="button-view-projects"
            >
              <Layers className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1" />
              View Projects
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 px-8 text-base group border-muted-foreground/30 hover:bg-accent/10"
              onClick={scrollToContact}
              data-testid="button-contact"
            >
              <Download className="mr-2 h-5 w-5 transition-transform group-hover:translate-y-1" />
              Download CV / Contact Me
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground"
      >
        <ArrowDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}