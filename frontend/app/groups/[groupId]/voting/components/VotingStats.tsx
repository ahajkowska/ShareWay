"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Award, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import type { Voting, VotingStats } from "../types";

interface VotingStatsProps {
  voting: Voting;
}

export default function VotingStats({ voting }: VotingStatsProps) {
  const totalVotes = voting.options.reduce((sum, opt) => sum + opt.votes.length, 0);
  
  // Get unique voters
  const uniqueVoters = new Set<string>();
  voting.options. forEach(opt => {
    opt.votes.forEach(vote => uniqueVoters.add(vote.userId));
  });

  const mostPopular = voting.options.length > 0
    ? [... voting.options].sort((a, b) => b.votes.length - a.votes.length)[0]
    : null;

  const stats = [
    {
      label: "Oddane głosy",
      value: totalVotes,
      icon: BarChart3,
      color: "text-blue-500",
    },
    {
      label: "Uczestników",
      value: uniqueVoters.size,
      icon: Users,
      color: "text-green-500",
    },
    {
      label: "Opcji",
      value: voting.options.length,
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      label: "Najpopularniejsza",
      value: mostPopular ?  `${mostPopular.votes.length} głosów` : "—",
      icon: Award,
      color: "text-amber-500",
      subtitle: mostPopular?. text,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats. map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {stat.subtitle}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}