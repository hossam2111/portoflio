import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export function Certificates() {
  const certificates = [
    "AutoCAD Professional Certification",
    "ArtCAM Advanced Programming",
    "CNC Machining Safety & Operations",
    "Rhino 3D Advanced Modeling",
    "3ds Max Visualization Professional",
    "Industrial Workflow Management"
  ];

  return (
    <section id="certificates" className="py-24">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 inline-flex items-center gap-3">
            <span className="w-8 h-[2px] bg-primary"></span>
            Certifications
            <span className="w-8 h-[2px] bg-primary"></span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {certificates.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card border-border hover:border-primary/40 transition-colors overflow-hidden group">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors text-muted-foreground">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {cert}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}