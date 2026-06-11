import { motion } from "framer-motion";
import { Cpu, PenTool, Settings, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function Services() {
  const services = [
    {
      title: "CNC Programming & Machining",
      description: "Expert toolpath generation and machine operation for precise execution of complex geometries.",
      icon: Cpu,
    },
    {
      title: "CAD/CAM Design & 3D Modeling",
      description: "Translating concepts into accurate 2D and 3D digital models ready for manufacturing.",
      icon: PenTool,
    },
    {
      title: "Workflow Optimization & Training",
      description: "Streamlining production processes and training teams on machine operation and safety.",
      icon: Settings,
    },
    {
      title: "Precision Prototyping & Production",
      description: "From rapid prototypes to full-scale production runs, ensuring quality at every step.",
      icon: Wrench,
    }
  ];

  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 inline-flex items-center gap-3">
            <span className="w-8 h-[2px] bg-primary"></span>
            Professional Services
            <span className="w-8 h-[2px] bg-primary"></span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Comprehensive solutions for modern manufacturing, bridging the gap between digital design and physical production.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card hover:bg-accent/5 border-border hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}