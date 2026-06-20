"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getServerSupabaseClient } from "@/lib/supabase";

const loginSchema = z.object({
  email: z.string().email("Niepoprawny email"),
  password: z.string().min(6, "Hasło musi mieć min. 6 znaków")
});

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    redirect(`/login?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Błąd formularza")}`);
  }

  const supabase = await getServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin");
}
