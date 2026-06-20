/**
 * Upload CV PDF files to Cloudflare R2 and update portfolio cvPdfPl/cvPdfEn fields.
 * Also sets radek's theme to retro-terminal.
 *
 * Uruchom: npx tsx scripts/upload-cv.ts
 */
import { loadEnvConfig } from "@next/env";
import path from "path";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

loadEnvConfig(path.resolve(__dirname, ".."));

const REPO_ROOT = path.resolve(__dirname, "../..");

const CV_UPLOADS = [
  {
    portfolioSlug: "radek",
    theme: "retro-terminal",
    pl: {
      localPath: path.join(REPO_ROOT, "portfolios/radek-stawiszynski/assets/cv/CV-RadosławStawiszyński-21.06.2024-PL-m.pdf"),
      r2Key: "radek/cv/cv-radek-pl.pdf",
    },
    en: {
      localPath: path.join(REPO_ROOT, "portfolios/radek-stawiszynski/assets/cv/CV-RadosławStawiszyński-21.06.2024-EN.pdf"),
      r2Key: "radek/cv/cv-radek-en.pdf",
    },
  },
  {
    portfolioSlug: "milosz",
    theme: null,
    pl: {
      localPath: path.join(REPO_ROOT, "portfolios/milosz-gawlik/assets/Miłosz Gawlik CV.pdf"),
      r2Key: "milosz/cv/cv-milosz-pl.pdf",
    },
    en: null,
  },
];

async function uploadToR2(s3: S3Client, bucket: string, key: string, filePath: string): Promise<string> {
  const body = fs.readFileSync(filePath);
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: "application/pdf",
  }));
  return `${process.env.R2_ENDPOINT}/${bucket}/${key}`;
}

async function run() {
  const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
  const bucket = process.env.R2_BUCKET_NAME!;

  const { getPayload } = await import("payload");
  const { default: configPromise } = await import("../payload.config");
  const payload = await getPayload({ config: configPromise });

  for (const entry of CV_UPLOADS) {
    console.log(`\n── Portfolio: ${entry.portfolioSlug} ──`);

    const portfolio = await payload.find({
      collection: "portfolios",
      where: { subdomain: { equals: entry.portfolioSlug } },
      limit: 1,
      overrideAccess: true,
    });
    if (!portfolio.docs.length) {
      console.warn(`⚠  Portfolio "${entry.portfolioSlug}" not found — skip`);
      continue;
    }
    const portfolioId = portfolio.docs[0].id;
    const updateData: Record<string, unknown> = {};

    // Upload PL CV
    if (entry.pl && fs.existsSync(entry.pl.localPath)) {
      const url = await uploadToR2(s3, bucket, entry.pl.r2Key, entry.pl.localPath);
      updateData.cvPdfPl = url;
      console.log(`✓  Uploaded PL CV → ${url}`);
    } else if (entry.pl) {
      console.warn(`⚠  PL CV not found: ${entry.pl.localPath}`);
    }

    // Upload EN CV
    if (entry.en && fs.existsSync(entry.en.localPath)) {
      const url = await uploadToR2(s3, bucket, entry.en.r2Key, entry.en.localPath);
      updateData.cvPdfEn = url;
      console.log(`✓  Uploaded EN CV → ${url}`);
    } else if (entry.en) {
      console.warn(`⚠  EN CV not found: ${entry.en.localPath}`);
    }

    // Set theme if specified
    if (entry.theme) {
      updateData.theme = entry.theme;
      console.log(`✓  Theme → ${entry.theme}`);
    }

    if (Object.keys(updateData).length > 0) {
      await payload.update({
        collection: "portfolios",
        id: portfolioId,
        data: updateData,
        overrideAccess: true,
      });
      console.log(`✓  Portfolio "${entry.portfolioSlug}" updated`);
    }
  }

  console.log("\n✅ Done!");
  process.exit(0);
}

run().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
