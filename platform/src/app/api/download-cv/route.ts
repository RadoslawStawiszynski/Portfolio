import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export async function GET(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const subdomain = host.split(".")[0];

  if (!subdomain) {
    return NextResponse.json({ error: "no_subdomain" }, { status: 400 });
  }

  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "portfolios",
    where: { subdomain: { equals: subdomain } },
    limit: 1,
    overrideAccess: true,
  });

  const portfolio = result.docs[0];
  if (!portfolio) {
    return NextResponse.json({ error: "portfolio_not_found" }, { status: 404 });
  }

  const lang = req.nextUrl.searchParams.get("lang") ?? "pl";
  const urlEn = portfolio.cvPdfEn as string | null | undefined;
  const urlPl = portfolio.cvPdfPl as string | null | undefined;

  const url = lang === "en" && urlEn ? urlEn : (urlPl ?? urlEn);

  if (!url) {
    return NextResponse.json({ error: "no_cv" }, { status: 404 });
  }

  return NextResponse.redirect(url, 307);
}
