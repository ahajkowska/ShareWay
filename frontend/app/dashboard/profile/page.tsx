"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { fetchAuth, apiUrl } from "@/lib/api";
import { useSession } from "@/app/context/SessionContext";
import { toast } from "sonner";

type ProfileResponse = {
  id: string;
  email: string;
  nickname: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, refresh } = useSession();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  const loadProfile = async () => {
    try {
      const data = await fetchAuth<ProfileResponse>(apiUrl("/users/me"), {
        method: "GET",
        cache: "no-store",
      });
      setProfile(data);
      setNickname(data.nickname ?? "");
    } catch (err: any) {
      toast.error(err?.message || "Nie udało się pobrać profilu");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const statusLabel = profile?.isActive ? "Aktywne" : "Nieaktywne";
  const createdAt = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("pl-PL")
    : "—";
  const updatedAt = profile?.updatedAt
    ? new Date(profile.updatedAt).toLocaleDateString("pl-PL")
    : "—";

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await fetchAuth(apiUrl("/users/me"), {
        method: "PATCH",
        body: JSON.stringify({ nickname }),
      });
      toast.success("Zapisano profil");
      await refresh();
      await loadProfile();
    } catch (err: any) {
      toast.error(err?.message || "Nie udało się zapisać profilu");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setPasswordSaving(true);
      await fetchAuth(apiUrl("/users/me/password"), {
        method: "PATCH",
        body: JSON.stringify(passwordForm),
      });
      toast.success("Zmieniono hasło");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err?.message || "Nie udało się zmienić hasła");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <>
      <main className="min-h-screen pt-24 pb-16 bg-gradient-soft">
        <div className="container mx-auto px-4 max-w-6xl">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Powrót do listy podróży
          </Button>

          <Card className="mb-6 border-none shadow-lg bg-gradient-to-r from-primary/5 to-travel-coral/5">
            <CardHeader>
              <CardTitle className="text-3xl">Twój profil</CardTitle>
              <p className="text-sm text-muted-foreground">
                Zarządzaj danymi i bezpieczeństwem konta.
              </p>
            </CardHeader>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{nickname || user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.email || user?.email}
                    </p>
                  </div>
                  <Badge variant="outline">{statusLabel}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <p className="uppercase text-[11px] tracking-widest">
                      Członek od
                    </p>
                    <p className="text-foreground font-medium">{createdAt}</p>
                  </div>
                  <div>
                    <p className="uppercase text-[11px] tracking-widest">
                      Ostatnia aktualizacja
                    </p>
                    <p className="text-foreground font-medium">{updatedAt}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nazwa wyświetlana</label>
                  <Input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Twoja nazwa"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Adres e-mail</label>
                  <Input value={profile?.email || user?.email || ""} disabled />
                </div>
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? "Zapisywanie..." : "Zapisz profil"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Bezpieczeństwo
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Weryfikacja i bezpieczeństwo konta.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Aktualne hasło</label>
                  <Input
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        oldPassword: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nowe hasło</label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Powtórz hasło</label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum 8 znaków, wielka i mała litera, cyfra oraz znak
                  specjalny.
                </p>
                <Button
                  variant="secondary"
                  onClick={handleChangePassword}
                  disabled={passwordSaving}
                >
                  {passwordSaving ? "Zapisywanie..." : "Zmień hasło"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
