"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Users,
  Wallet,
  MapPin,
  ListChecks,
  Vote,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useI18n } from "@/app/context/LanguageContext";

export default function FeatureGrid() {
  const { t, lang } = useI18n();
  const prefersReducedMotion = useReducedMotion();

  const icons = [Users, Wallet, MapPin, ListChecks, Vote, ShieldCheck] as const;

  const items =
    (t?.features?.items ?? []).map((f, i) => ({
      ...f,
      icon: icons[i % icons.length],
      key: `${lang}-${f.title}-${i}`,
    })) ?? [];

  const container: Variants = {
    hidden: {},
    visible: {
      transition: prefersReducedMotion
        ? undefined
        : { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      key={`features-${lang}`}
      id="features"
      className="py-24 bg-gradient-soft"
    >
      <div className="container mx-auto px-4">
        <motion.div
          variants={item}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            {t?.features?.heading}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t?.features?.sub}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
            margin: "-10% 0px -10% 0px",
          }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {items.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div key={feature.key} variants={item}>
                <Card className="h-full border-2 hover:border-primary/50 transition-all hover:shadow-glow group">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
