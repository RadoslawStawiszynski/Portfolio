import { redirect } from "next/navigation";
import { getServerSupabaseClient } from "@/lib/supabase";

export async function requireAdminSession() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?error=Zaloguj+si%C4%99%2C+aby+uzyska%C4%87+dost%C4%99p");
  }

  const allowedAdminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const userEmail = session.user.email?.toLowerCase().trim();

  if (allowedAdminEmail && userEmail !== allowedAdminEmail) {
    redirect("/login?error=Brak+uprawnie%C5%84+admina");
  }

  return { supabase, session };
}
