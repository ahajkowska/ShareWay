"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Vote,
  Wallet,
  Calendar,
  ListChecks,
  ArrowLeft,
  Users,
  UserMinus,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useI18n } from "@/app/context/LanguageContext";
import { fetchTrip, fetchParticipants } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useSession } from "@/app/context/SessionContext";
import { removeParticipant, transferRole } from "@/lib/api";
import { toast } from "sonner";

export default function GroupDashboard() {
    const params = useParams();
    const router = useRouter();
    const groupId = params.groupId as string;
    const { t } = useI18n();
    const [tripName, setTripName] = useState<string>("");
    const [tripLocation, setTripLocation] = useState<string>("");
    const [loadingTrip, setLoadingTrip] = useState(true);
    const [participants, setParticipants] = useState<
      Array<{ id: string; name: string; role: "ORGANIZER" | "PARTICIPANT" }>
    >([]);
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
      {}
    );
    const { user: currentUser } = useSession();

    useEffect(() => {
      const load = async () => {
        setLoadingTrip(true);
        try {
          const trip = await fetchTrip(groupId);
          setTripName(trip.name);
          setTripLocation(trip.destination);
          const data = await fetchParticipants(groupId);
          const mapped = data.map((p) => ({
            id: p.userId,
            name: p.user?.nickname || p.user?.email || "Użytkownik",
            role: p.role,
          }));
          setParticipants(mapped);
        } catch (err: any) {
          console.error("Error loading trip:", err);
          toast.error("Nie znaleziono podróży");
          router.push("/dashboard");
        } finally {
          setLoadingTrip(false);
        }
      };
      if (groupId) {
        void load();
      }
    }, [groupId, router]);

    const currentUserId = currentUser?.id ?? null;
    const currentUserRole =
      participants.find((p) => p.id === currentUserId)?.role ?? null;
    const isOrganizer = currentUserRole === "ORGANIZER";
    const organizerCount = participants.filter((p) => p.role === "ORGANIZER").length;

    const handleRemove = async (userId: string, name: string) => {
      const isSelf = userId === currentUserId;
      
      // Check if user is the last organizer trying to leave
      if (isSelf && currentUserRole === "ORGANIZER" && organizerCount === 1) {
        toast.error("Nie możesz opuścić podróży jako ostatni organizator. Wyznacz najpierw nowego organizatora.");
        return;
      }
      
      const message = isSelf 
        ? "Czy na pewno chcesz opuścić tę podróż?"
        : `Czy na pewno chcesz usunąć użytkownika ${name} z tej podróży?`;
      
      toast.info(message, {
        action: {
          label: isSelf ? "Opuść" : "Usuń",
          onClick: async () => {
            try {
              setActionLoading((prev) => ({ ...prev, [userId]: true }));
              await removeParticipant(groupId, userId);
              setParticipants((prev) => prev.filter((p) => p.id !== userId));
              toast.success(`${name} został usunięty z podróży`);
              
              // If user removed themselves, redirect to dashboard
              if (isSelf) {
                router.push("/dashboard");
              }
            } catch (err) {
              console.error("Error removing participant:", err);
              toast.error("Nie udało się usunąć uczestnika.");
            } finally {
              setActionLoading((prev) => ({ ...prev, [userId]: false }));
            }
          },
        },
      });
    };

    const handleToggleRole = async (
      userId: string,
      role: "ORGANIZER" | "PARTICIPANT"
    ) => {
      const newRole = role === "ORGANIZER" ? "PARTICIPANT" : "ORGANIZER";
      try {
        setActionLoading((prev) => ({ ...prev, [userId]: true }));
        await transferRole(groupId, userId, newRole);
        setParticipants((prev) =>
          prev.map((p) => (p.id === userId ? { ...p, role: newRole } : p))
        );
        toast.success(`Rola została zmieniona`);
      } catch (err) {
        console.error("Error updating role:", err);
        toast.error("Nie udało się zmienić roli.");
      } finally {
        setActionLoading((prev) => ({ ...prev, [userId]: false }));
      }
    };

    const modules = [
        {
            name: t.dashboard.modules?.voting.name,
            icon: Vote,
            href: `/dashboard/${groupId}/voting`,
            description: t.dashboard.modules?.voting.description,
            color: "from-blue-500 to-cyan-500",
        },
        {
            name: t.dashboard.modules?.costs.name,
            icon: Wallet,
            href: `/dashboard/${groupId}/costs`,
            description: t.dashboard.modules?.costs.description,
            color: "from-blue-500 to-cyan-500",
        },
        {
            name: t.dashboard.modules?.schedule.name,
            icon: Calendar,
            href: `/dashboard/${groupId}/schedule`,
            description: t.dashboard.modules?.schedule.description,
            color: "from-blue-500 to-cyan-500",
        },
        {
            name: t.dashboard.modules?.checklist.name,
            icon: ListChecks,
            href: `/dashboard/${groupId}/checklist`,
            description: t.dashboard.modules?.checklist.description,
            color: "from-blue-500 to-cyan-500",
        },
    ];

    return (
        <>
            <main className="min-h-screen pt-24 pb-16 bg-gradient-soft">
                <div className="container mx-auto px-4">
                    {/* Back button */}
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/dashboard')}
                        className="mb-6 gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t.dashboard.backToTrips}
                    </Button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        {loadingTrip ? (
                          <div className="space-y-3">
                            <div className="h-10 w-72 bg-muted/60 rounded-xl animate-pulse" />
                            <div className="h-6 w-48 bg-muted/50 rounded-lg animate-pulse" />
                          </div>
                        ) : (
                          <>
                            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
                              {tripName}
                            </h1>
                            <p className="text-xl text-muted-foreground">
                              {tripLocation}
                            </p>
                          </>
                        )}
                    </motion.div>

                    <Card className="mb-8">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Uczestnicy
                        </CardTitle>
                        {!loadingTrip && (
                          <span className="text-xs text-muted-foreground">
                            {participants.length} osoba
                          </span>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-3">
                          {loadingTrip
                            ? Array.from({ length: 3 }).map((_, idx) => (
                                <div
                                  key={`skeleton-${idx}`}
                                  className="h-10 w-44 rounded-full bg-muted/50 animate-pulse"
                                />
                              ))
                            : participants.map((p, idx) => {
                              const isSelf = currentUserId === p.id;
                              const canManage = isOrganizer && !isSelf;
                              const busy = actionLoading[p.id];
                              return (
                            <div
                              key={p.id}
                              className="flex items-center gap-2 rounded-full border border-border/60 px-3 py-2 bg-card/80"
                            >
                              <Avatar className="h-7 w-7">
                                <AvatarFallback
                                  className={cn(
                                    "text-[10px] font-semibold text-white",
                                    idx % 2 === 0
                                      ? "bg-primary/70"
                                      : "bg-travel-coral/70"
                                  )}
                                >
                                  {p.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-sm font-medium">{p.name}</div>
                              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                                {p.role === "ORGANIZER" ? "Organizator" : "Uczestnik"}
                              </span>

                              {canManage && (
                                <div className="flex items-center gap-1 ml-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={busy}
                                    onClick={() => handleToggleRole(p.id, p.role)}
                                    className="h-7 w-7 rounded-full"
                                    aria-label={
                                      p.role === "ORGANIZER"
                                        ? "Zmień na uczestnika"
                                        : "Zmień na organizatora"
                                    }
                                  >
                                    {p.role === "ORGANIZER" ? (
                                      <ShieldOff className="h-3.5 w-3.5" />
                                    ) : (
                                      <ShieldCheck className="h-3.5 w-3.5" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={busy}
                                    onClick={() => handleRemove(p.id, p.name)}
                                    className="h-7 w-7 rounded-full text-destructive hover:text-destructive"
                                    aria-label="Usuń uczestnika"
                                  >
                                    <UserMinus className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              )}
                              {isSelf && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={busy}
                                  onClick={() => handleRemove(p.id, p.name)}
                                  className="ml-2 text-xs"
                                >
                                  Opuść
                                </Button>
                              )}
                            </div>
                          );
                          })}
                        </div>
                      </CardContent>
                    </Card>

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
