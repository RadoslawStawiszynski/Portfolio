import { NextResponse } from "next/server";
import { getActivePalette } from "@/lib/data-access";

export async function GET() {
  const [light, dark] = await Promise.all([getActivePalette("light"), getActivePalette("dark")]);

  return NextResponse.json({
    theme: {
      light,
      dark
    }
  });
}
