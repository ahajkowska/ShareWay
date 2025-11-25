"use client";

import { motion, useReducedMotion } from "framer-motion";
import { UserPlus, Map, DollarSign } from "lucide-react";
import { useI18n } from "@/app/context/LanguageContext";

export default function HowItWorks() {
  const { t, lang } = useI18n();
  const prefersReducedMotion = useReducedMotion();

  const icons = [UserPlus, Map, DollarSign] as const;
  const steps = (t?.how?.steps ?? []).map((s, i) => ({
    title: s.title,
    description: s.description,
    icon: icons[i % icons.length],
    step: String(i + 1).padStart(2, "0"),
  }));

  const header = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const container = {
    hidden: {},
    visible: {
      transition: prefersReducedMotion
        ? undefined
        : { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section key={`how-${lang}`} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          variants={header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            {t?.how?.heading}
          </h2>
          <p className="text-xl text-muted-foreground">{t?.how?.sub}</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.article
                key={`${lang}-${step.title}-${index}`}
                variants={item as any}
                className="text-center relative"
              >
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden md:block absolute top-20 left-[60%] h-0.5 bg-linear-to-r from-primary to-secondary"
                    style={{ width: "80%", transformOrigin: "left" }}
                    initial={{ scaleX: 0, opacity: 0.6 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.2,
                    }}
                  />
                )}

                <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
                  <div className="absolute inset-0 bg-gradient-sunrise rounded-full opacity-20" />
                  <div className="relative w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center shadow-glow">
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-(--shadow-accent)">
                    {step.step}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
