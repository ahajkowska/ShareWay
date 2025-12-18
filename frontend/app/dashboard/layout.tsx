import DashboardNavbar from "@/app/dashboard/components/DashboardNavbar";
import { requireUser } from "@/lib/auth/requireUser";
import { SessionProvider } from "@/app/context/SessionContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser("/dashboard");

  return (
    <>
      <DashboardNavbar user={user} />
      <SessionProvider initialUser={user}>
        <main className="pt-16">{children}</main>
      </SessionProvider>
    </>
  );
}
