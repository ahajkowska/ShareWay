import DashboardNavbar from "@/app/dashboard/components/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = {
    id: "TEMP-ID",
    name: "Demo User",
    email: "demo@shareway.app",
  };

  return (
    <>
      <DashboardNavbar user={user} />
      <main className="pt-16">{children}</main>
    </>
  );
}
