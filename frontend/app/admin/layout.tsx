import { requireUser } from "@/lib/auth/requireUser";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/app/dashboard/components/DashboardNavbar";
import { SessionProvider } from "@/app/context/SessionContext";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser("/admin");

  // Check if user is admin
  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <>
      <DashboardNavbar user={user} />
      <SessionProvider initialUser={user}>
        <main className="pt-16">{children}</main>
      </SessionProvider>
    </>
  );
}
