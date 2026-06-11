import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Languages, Globe } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export function About() {
  const stats = [
    { label: "Years Experience", value: "7+" },
    { label: "Companies", value: "2" },
    { label: "Specializations", value: "3" }
  ];

  const personalInfo = [
    { icon: MapPin, label: "Location", value: "Nasr City, Cairo, Egypt", subValue: "(Open to relocate)" },
    { icon: Mail, label: "Email", value: "ibrahimyo1311@gmail.com" },
    { icon: Phone, label: "Phone", value: "+20 1066038136" },
    { icon: Languages, label: "Languages", value: "Arabic (Native), English (Proficient), German (Basic)" },
    { icon: Globe, label: "Nationality", value: "Egyptian" }
  ];

  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-primary"></span>
            About the Craftsman
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-2xl font-semibold mb-6">Precision engineered solutions</h3>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              I am a dedicated CNC Programmer and Designer with a passion for transforming complex digital models into tangible, high-quality products. Over the past 7 years, I have honed my skills in precision manufacturing, workflow optimization, and CAD/CAM software.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              My approach combines technical rigor with an eye for design, allowing me to bridge the gap between creative concept and mechanical execution. Whether programming intricate architectural carvings or machining industrial components with zero tolerance for error, I approach every project with a master craftsman&apos;s mindset.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-4xl font-bold text-primary mb-2">{stat.value}</span>
                  <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-card border-border shadow-md h-full">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6 border-b border-border pb-4">Personal Information</h3>
                <ul className="space-y-6">
                  {personalInfo.map((info, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <info.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">{info.label}</p>
                        <p className="text-foreground font-medium">{info.value}</p>
                        {info.subValue && <p className="text-sm text-primary mt-1">{info.subValue}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}