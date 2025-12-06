"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Vote, Wallet, Calendar, ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import Navbar from "@/app/components/Navbar";
import { useI18n } from "@/app/context/LanguageContext";

export default function GroupDashboard() {
    const params = useParams();
    const groupId = params.groupId as string;
    const { t } = useI18n();

    const modules = [
        {
            name: t.dashboard.modules.voting.name,
            icon: Vote,
            href: `/groups/${groupId}/voting`,
            description: t.dashboard.modules.voting.description,
            color: "from-blue-500 to-cyan-500",
        },
        {
            name: t.dashboard.modules.costs.name,
            icon: Wallet,
            href: `/groups/${groupId}/costs`,
            description: t.dashboard.modules.costs.description,
            color: "from-blue-500 to-cyan-500",
        },
        {
            name: t.dashboard.modules.schedule.name,
            icon: Calendar,
            href: `/groups/${groupId}/schedule`,
            description: t.dashboard.modules.schedule.description,
            color: "from-blue-500 to-cyan-500",
        },
        {
            name: t.dashboard.modules.checklist.name,
            icon: ListChecks,
            href: `/groups/${groupId}/checklist`,
            description: t.dashboard.modules.checklist.description,
            color: "from-blue-500 to-cyan-500",
        },
    ];

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16 bg-gradient-soft">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
                            {t.dashboard.title}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {t.dashboard.subtitle}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {modules.map((module, index) => {
                            const Icon = module.icon;
                            return (
                                <motion.div
                                    key={module.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={module.href}>
                                        <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group border-2 hover:border-primary/50">
                                            <CardHeader>
                                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                                                    <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                                                </div>
                                                <CardTitle className="text-2xl">{module.name}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground">
                                                    {module.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </>
    );
}