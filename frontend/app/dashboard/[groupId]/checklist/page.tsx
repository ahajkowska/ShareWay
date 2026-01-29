"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useI18n } from "@/app/context/LanguageContext";
import { getChecklistTranslations } from "./translations";
import * as api from "@/lib/api";
import { toast } from "sonner";
import ChecklistList from "./components/ChecklistList";
import AddItemForm from "./components/AddItemForm";
import type { ChecklistItemDto } from "./types";

export default function ChecklistPage() {
  const { lang } = useI18n();
  const t = getChecklistTranslations(lang);
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const [items, setItems] = useState<ChecklistItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = (await api.fetchChecklist(groupId)) as any[];
      // Transform backend response to frontend type
      const transformedItems: ChecklistItemDto[] = (data || []).map(
        (item: any) => ({
          id: item.id,
          text: item.text,
          isChecked: item.isChecked ?? false,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        })
      );
      setItems(transformedItems);
    } catch (err: any) {
      console.error("Error loading checklist:", err);
      setError(err.message || t.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      load();
    }
  }, [groupId]);

  const handleAdd = async (text: string) => {
    try {
      await api.addChecklistItem(groupId, text);
      await load();
      setIsAddOpen(false);
    } catch (err: any) {
      console.error("Error adding item:", err);
      toast.error(err.message || t.addError);
    }
  };

  const handleToggle = async (itemId: string, newChecked: boolean) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, isChecked: newChecked } : i))
    );

    try {
      await api.toggleChecklistItemStatus(itemId, newChecked);
    } catch (err: any) {
      console.error("Error toggling item:", err);
      // Revert on error
      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, isChecked: !newChecked } : i
        )
      );
      toast.error(err.message || t.toggleError);
    }
  };

  const completedCount = items.filter((i) => i.isChecked).length;
  const totalCount = items.length;

  const handleDelete = async (itemId: string) => {
    try {
      await api.deleteChecklistItem(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err: any) {
      console.error("Error deleting item:", err);
      toast.error(err.message || t.deleteError);
    }
  };

  return (
    <>
      <main className="min-h-screen pt-24 pb-16 bg-gradient-soft">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => router.push(`/dashboard/${groupId}`)}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToGroup}
          </Button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t.checklistTitle}</span>
                  <Button
                    onClick={() => setIsAddOpen((v) => !v)}
                    className="gap-2"
                    variant={isAddOpen ? "outline" : "default"}
                  >
                    <Plus className="w-4 h-4" />
                    {isAddOpen ? t.cancel : t.addItem}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {t.checklistDescription}
                </p>
                {totalCount > 0 && (
                  <p className="text-sm font-medium text-primary">
                    {t.itemsCompleted(
                      completedCount.toString(),
                      totalCount.toString()
                    )}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Add Item Form */}
          {isAddOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <AddItemForm
                onSubmit={handleAdd}
                onCancel={() => setIsAddOpen(false)}
              />
            </motion.div>
          )}

          {/* Checklist Items */}
          <ChecklistList
            items={items}
            loading={loading}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onRefresh={load}
            error={error}
          />
        </div>
      </main>
    </>
  );
}
