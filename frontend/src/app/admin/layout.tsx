import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  // We can reuse DashboardLayout or create a specific AdminSidebar later
  return <DashboardLayout>{children}</DashboardLayout>;
}
