"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Vote, Wallet, Calendar, ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import Navbar from "@/app/components/Navbar";

export default function GroupDashboard() {
    const params = useParams();
    const groupId = params.groupId as string;

    const modules = [
        {
        name: "Głosowanie",
        icon: Vote,
        href: `/groups/${groupId}/voting`,
        description: "Podejmujcie decyzje wspólnie",
        color: "from-blue-500 to-cyan-500",
        },
        {
        name: "Koszty",
        icon: Wallet,
        href: `/groups/${groupId}/costs`,
        description: "Rozliczajcie wspólne wydatki",
        color: "from-blue-500 to-cyan-500",
        },
        {
        name: "Harmonogram",
        icon: Calendar,
        href: `/groups/${groupId}/schedule`,
        description: "Planujcie trasę i atrakcje",
        color: "from-blue-500 to-cyan-500",
        },
        {
        name: "Lista kontrolna",
        icon: ListChecks,
        href: `/groups/${groupId}/checklist`,
        description: "Co zabrać i co zrobić",
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
                Wyprawa do Grecji
                </h1>
                <p className="text-xl text-muted-foreground">
                Wybierz moduł, aby zarządzać swoją podróżą
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