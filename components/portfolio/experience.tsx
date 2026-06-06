import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

export function Experience() {
  const experiences = [
    {
      title: "CNC Programmer & Operator",
      company: "Aikon for Industry",
      period: "Feb 2018 – Present",
      duties: [
        "Programmed and executed CNC projects with precision and top-quality standards",
        "Designed components using AutoCAD, ArtCAM, Rhino, 3ds Max, Maestro, EasyWOOD",
        "Supervised and maintained CNC machinery; troubleshooting and repairs",
        "Trained new operators on CNC programming, setup, and safety protocols",
        "Managed workflow for production efficiency and zero machine downtime"
      ]
    },
    {
      title: "CNC Operator & Designer",
      company: "Al-Fanar Wood Industries",
      period: "Jan 2015 – Mar 2017",
      duties: [
        "Operated and programmed CNC machines for wood and interior design production",
        "Designed custom furniture and decorative pieces using ArtCAM, Rhino, AutoCAD",
        "Collaborated with designers to convert sketches into CNC-ready files",
        "Prepared toolpaths, optimized cutting speeds, ensured precision in machining",
        "Performed regular maintenance and calibration for CNC routers",
        "Assisted in material selection and project costing"
      ]
    }
  ];

  return (
    <section id="experience" className="py-24 bg-muted/30">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-primary"></span>
            Professional Experience
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative border-l-2 border-primary/20 ml-3 md:ml-6 space-y-12">
            {experiences.map((exp, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative pl-8 md:pl-12"
              >
                <div className="absolute w-10 h-10 bg-background border-2 border-primary rounded-full -left-[21px] flex items-center justify-center top-0 shadow-sm shadow-primary/20">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{exp.title}</h3>
                    <h4 className="text-lg text-muted-foreground font-medium">{exp.company}</h4>
                  </div>
                  <span className="inline-block mt-2 md:mt-0 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>
                
                <ul className="space-y-3 mt-6">
                  {exp.duties.map((duty, i) => (
                    <li key={i} className="flex items-start text-muted-foreground">
                      <span className="mr-3 mt-1.5 text-primary text-sm">▹</span>
                      <span className="leading-relaxed">{duty}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}