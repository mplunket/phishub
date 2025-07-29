import LandingPage from "@/components/landing-page";
import DashboardHome from "@/components/dashboard-home";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return <DashboardHome />;
  }

  return <LandingPage />;
}
