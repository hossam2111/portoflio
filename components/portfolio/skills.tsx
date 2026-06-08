import { motion } from "framer-motion";
import { Badge } from "../ui/badge";

export function Skills() {
  const technicalSkills = [
    { name: "AutoCAD (2D & 3D)", level: 95 },
    { name: "ArtCAM (Toolpath Programming)", level: 90 },
    { name: "3ds Max (Visualization)", level: 85 },
    { name: "Rhino (3D Modeling)", level: 88 },
    { name: "Maestro & EasyWOOD (CNC)", level: 92 },
    { name: "CNC Machine Maintenance", level: 85 },
    { name: "Team Training & Workflow Management", level: 80 }
  ];

  const softSkills = [
    "Leadership", "Public Speaking", "Communication", 
    "Multitasking", "Resilience", "Presentation Skills", "Self-Learning"
  ];

  return (
    <section id="skills" className="py-24">
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
            Skills & Education
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-2xl font-semibold mb-8 border-b border-border pb-4">Technical Expertise</h3>
            <div className="space-y-6">
              {technicalSkills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-foreground">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-12"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-8 border-b border-border pb-4">Soft Skills</h3>
              <div className="flex flex-wrap gap-3">
                {softSkills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="px-4 py-2 text-sm bg-accent/10 text-foreground hover:bg-accent/20 border border-primary/20"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-8 border-b border-border pb-4">Education</h3>
              <div className="relative pl-6 border-l-2 border-primary/30">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-2"></div>
                <h4 className="text-xl font-bold text-foreground">Bachelor&apos;s in Law and Sharia</h4>
                <p className="text-primary font-medium mb-2">Al-Azhar University, Cairo</p>
                <p className="text-muted-foreground">GPA: 3.2</p>
                <p className="text-muted-foreground mt-2 text-sm">
                  While my formal education is in Law, my passion and autodidactic drive led me to master engineering design and precision manufacturing, demonstrating strong self-learning and analytical capabilities.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}