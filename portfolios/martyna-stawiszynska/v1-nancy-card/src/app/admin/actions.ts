"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { getServerSupabaseClient } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

const postSchema = z.object({
  title: z.string().min(3, "Tytuł jest za krótki"),
  content: z.string().min(10, "Treść musi mieć min. 10 znaków"),
  status: z.enum(["draft", "published"])
});

const paletteSchema = z.object({
  name: z.string().min(2),
  mode: z.enum(["light", "dark"]),
  background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  text: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  button: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  active: z.boolean()
});

export async function logoutAction() {
  const { supabase } = await requireAdminSession();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createPostAction(formData: FormData) {
  await requireAdminSession();

  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    status: formData.get("status")
  });

  if (!parsed.success) {
    redirect(`/admin?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Błąd walidacji posta")}`);
  }

  const supabase = await getServerSupabaseClient();
  const nowIso = new Date().toISOString();

  const { error } = await supabase.from("posts").insert({
    title: parsed.data.title,
    slug: slugify(parsed.data.title),
    content: parsed.data.content,
    status: parsed.data.status,
    published_at: parsed.data.status === "published" ? nowIso : null
  });

  if (error) {
    redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createPaletteAction(formData: FormData) {
  await requireAdminSession();

  const parsed = paletteSchema.safeParse({
    name: formData.get("name"),
    mode: formData.get("mode"),
    background: formData.get("background"),
    text: formData.get("text"),
    accent: formData.get("accent"),
    button: formData.get("button"),
    active: formData.get("active") === "on"
  });

  if (!parsed.success) {
    redirect(`/admin?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Błąd walidacji palety")}`);
  }

  const supabase = await getServerSupabaseClient();

  if (parsed.data.active) {
    await supabase.from("themes").update({ active: false }).eq("mode", parsed.data.mode);
  }

  const { error } = await supabase.from("themes").insert({
    name: parsed.data.name,
    mode: parsed.data.mode,
    background: parsed.data.background,
    text: parsed.data.text,
    accent: parsed.data.accent,
    button: parsed.data.button,
    archived: false,
    active: parsed.data.active
  });

  if (error) {
    redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function uploadMediaAction(formData: FormData) {
  await requireAdminSession();

  const file = formData.get("media") as File | null;
  const alt = String(formData.get("alt") ?? "").trim();
  const source = String(formData.get("source") ?? "admin-upload").trim();

  if (!file || file.size === 0) {
    redirect("/admin?error=Nie+wybrano+pliku");
  }

  if (file.size > 5 * 1024 * 1024) {
    redirect("/admin?error=Plik+przekracza+limit+5MB");
  }

  const supabase = await getServerSupabaseClient();
  const extension = file.name.split(".").pop() ?? "bin";
  const storagePath = `media/${Date.now()}-${Math.random().toString(16).slice(2)}.${extension}`;

  const { error: uploadError } = await supabase.storage.from("assets").upload(storagePath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "application/octet-stream"
  });

  if (uploadError) {
    redirect(`/admin?error=${encodeURIComponent(uploadError.message)}`);
  }

  const { data: publicData } = supabase.storage.from("assets").getPublicUrl(storagePath);

  const { error: dbError } = await supabase.from("media_assets").insert({
    url: publicData.publicUrl,
    type: file.type.startsWith("video") ? "video" : "image",
    alt,
    source,
    metadata: {
      filename: file.name,
      size: file.size,
      contentType: file.type
    }
  });

  if (dbError) {
    redirect(`/admin?error=${encodeURIComponent(dbError.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}
