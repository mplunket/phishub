import { DashboardShell } from "@/components/dashboard-shell";

export default function DashboardHome() {
  return (
    <DashboardShell>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard!</h1>
        <p className="text-lg text-gray-600">
          This is your personalized Phishub dashboard. Add your dashboard
          widgets or content here.
        </p>
      </div>
    </DashboardShell>
  );
}
