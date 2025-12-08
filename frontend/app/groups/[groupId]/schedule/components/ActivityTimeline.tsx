"use client";

import { format } from "date-fns";
import { Clock, MapPin, Edit, Trash2, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/app/context/LanguageContext";
import { getScheduleTranslations } from "../translations";
import { cn } from "@/lib/utils";
import type { ActivityDto } from "../types";
import EditActivityDialog from "./EditActivityDialog";
import * as api from "@/lib/api";

interface Props {
    activities: ActivityDto[];
    onRefresh: () => void;
}

export default function ActivityTimeline({ activities, onRefresh }: Props) {
    const { lang } = useI18n();
    const t = getScheduleTranslations(lang);
    const [editingActivity, setEditingActivity] = useState<ActivityDto | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    // Sort activities by time
    const sortedActivities = [...activities].sort((a, b) => 
        (a.startTime || "").localeCompare(b.startTime || "")
    );

    const handleDelete = async (activityId: string) => {
        if (!confirm(t.deleteActivityConfirm)) return;
        
        try {
            setDeleting(activityId);
            await api.deleteActivity(activityId);
            onRefresh();
        } catch (err: any) {
            console.error("Error deleting activity:", err);
            alert(err.message || t.deleteActivityError);
        } finally {
            setDeleting(null);
        }
    };

    if (sortedActivities.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">{t.noActivitiesPlanned}</p>
            </div>
        );
    }

    return (
        <>
            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20" />

                {/* Activities */}
                <div className="space-y-6">
                    {sortedActivities.map((activity, index) => (
                        <div key={activity.id} className="relative pl-16 group">
                            {/* Time Dot */}
                            <div className="absolute left-3.5 top-1 w-5 h-5 rounded-full bg-primary border-4 border-background shadow-md" />

                            {/* Time Badge */}
                            {activity.startTime && (
                                <div className="absolute left-12 top-0 flex items-center gap-1.5 text-xs font-mono font-medium text-primary">
                                    <Clock className="w-3.5 h-3.5" />
                                    {format(new Date(activity.startTime), "HH:mm")}
                                    {activity.endTime && (
                                        <span className="text-muted-foreground">
                                            - {format(new Date(activity.endTime), "HH:mm")}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Activity Card */}
                            <div className={cn(
                                "mt-6 p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200",
                                "border-l-4 border-l-primary/60"
                            )}>
                                {/* Title */}
                                <h4 className="font-semibold text-base mb-2">
                                    {activity.title}
                                </h4>

                                {/* Description */}
                                {activity.description && (
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {activity.description}
                                    </p>
                                )}

                                {/* Location */}
                                {activity.location && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{activity.location}</span>
                                    </div>
                                )}

                                {/* Created By */}
                                {activity.createdBy && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                        <User className="w-3.5 h-3.5" />
                                        <span>{t.addedBy}: {activity.createdBy}</span>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditingActivity(activity)}
                                        className="h-8 text-xs"
                                    >
                                        <Edit className="w-3 h-3 mr-1" />
                                        {t.edit}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(activity.id)}
                                        disabled={deleting === activity.id}
                                        className="h-8 text-xs text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-3 h-3 mr-1" />
                                        {deleting === activity.id ? t.deleting : t.delete}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Dialog */}
            {editingActivity && (
                <EditActivityDialog
                    open={!!editingActivity}
                    onOpenChange={(open) => !open && setEditingActivity(null)}
                    activity={editingActivity}
                    onUpdated={() => {
                        setEditingActivity(null);
                        onRefresh();
                    }}
                />
            )}
        </>
    );
}