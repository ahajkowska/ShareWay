"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useI18n } from "@/app/context/LanguageContext";

const expenses = [
  {
    id: 1,
    namePL: "Hotel Kraków",
    nameEN: "Hotel in Kraków",
    amount: 450,
    payer: "Anna",
    avatarColor: "bg-primary",
  },
  {
    id: 2,
    namePL: "Benzyna",
    nameEN: "Fuel",
    amount: 280,
    payer: "Bartek",
    avatarColor: "bg-secondary",
  },
  {
    id: 3,
    namePL: "Restauracja",
    nameEN: "Restaurant",
    amount: 320,
    payer: "Celina",
    avatarColor: "bg-primary",
  },
  {
    id: 4,
    namePL: "Bilety muzeum",
    nameEN: "Museum tickets",
    amount: 120,
    payer: "Dawid",
    avatarColor: "bg-secondary",
  },
] as const;

const timeline = [
  {
    dayPL: "Dzień 1",
    dayEN: "Day 1",
    titlePL: "Przyjazd do Krakowa",
    titleEN: "Arrival in Kraków",
    time: "14:00",
  },
  {
    dayPL: "Dzień 2",
    dayEN: "Day 2",
    titlePL: "Wawel i Stare Miasto",
    titleEN: "Wawel & Old Town",
    time: "09:00",
  },
  {
    dayPL: "Dzień 3",
    dayEN: "Day 3",
    titlePL: "Wieliczka",
    titleEN: "Wieliczka Salt Mine",
    time: "10:00",
  },
] as const;

export default function ShowcasePreview() {
  const { t, lang } = useI18n();

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const participants = new Set(expenses.map((e) => e.payer)).size || 1;
  const perPerson = total / participants;

  return (
    <section className="py-24 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            {t.showcase.heading}
          </h2>
          <p className="text-xl text-muted-foreground">{t.showcase.sub}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-2 shadow-glow">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t.showcase.expensesTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {expenses.map((expense, index) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className={expense.avatarColor}>
                        <AvatarFallback className="text-white font-semibold">
                          {expense.payer[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {lang === "pl" ? expense.namePL : expense.nameEN}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t.showcase.paidBy}: {expense.payer}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                      className="text-xl font-bold text-primary"
                    >
                      {expense.amount} zł
                    </motion.div>
                  </motion.div>
                ))}

                <div className="mt-6 p-4 rounded-xl bg-gradient-hero text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">{t.showcase.total}:</span>
                    <span className="text-3xl font-bold">{total} zł</span>
                  </div>
                  <p className="text-sm text-white/80 mt-2">
                    {t.showcase.perPerson}: {perPerson.toFixed(2)} zł
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border border-border/70 shadow-sm dark:shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t.showcase.itineraryTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {timeline.map((item, index) => (
                  <motion.div
                    key={`${item.dayPL}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.15 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className="
                          w-12 h-12 rounded-full bg-gradient-sunrise
                          flex items-center justify-center
                          font-bold text-neutral-900 dark:text-white
                        "
                      >
                        {index + 1}
                      </div>

                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-16 bg-linear-to-b from-primary to-secondary" />
                      )}
                    </div>

                    <div className="flex-1 pb-8">
                      <Badge className="mb-2">
                        {lang === "pl" ? item.dayPL : item.dayEN}
                      </Badge>
                      <h4 className="font-bold text-lg mb-1">
                        {lang === "pl" ? item.titlePL : item.titleEN}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t.showcase.startLabel}: {item.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
