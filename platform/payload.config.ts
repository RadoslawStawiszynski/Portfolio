import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { Users } from "@/payload/collections/Users";
import { Portfolios } from "@/payload/collections/Portfolios";
import { Blocks } from "@/payload/collections/Blocks";
import { Media } from "@/payload/collections/Media";
import { Todos } from "@/payload/collections/Todos";
import { WaitlistRequests } from "@/payload/collections/WaitlistRequests";
import { InvitationTokens } from "@/payload/collections/InvitationTokens";
import { PlatformSettings } from "@/payload/globals/PlatformSettings";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} env var`);
  return value;
}

// Walidowane wcześnie (fail-fast przy starcie) zamiast `!` non-null assertions,
// które przy braku zmiennej ładnie się typują ale wysypują dopiero przy uploadzie (TD-02)
const r2Endpoint = requireEnv("R2_ENDPOINT");
const r2Bucket = requireEnv("R2_BUCKET_NAME");
const r2AccessKeyId = requireEnv("R2_ACCESS_KEY_ID");
const r2SecretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: "/src/payload/components/Logo#AdminLogo",
        Icon: "/src/payload/components/Logo#AdminIcon",
      },
    },
    meta: {
      titleSuffix: " — PortfolioHub",
    },
  },
  collections: [Users, Portfolios, Blocks, Media, Todos, WaitlistRequests, InvitationTokens],
  globals: [PlatformSettings],
  editor: lexicalEditor(),
  secret: requireEnv("PAYLOAD_SECRET"),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: requireEnv("DATABASE_URL"),
    },
  }),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  localization: {
    locales: [
      { label: "Polski", code: "pl" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "pl",
    fallback: true,
  },
  upload: {
    limits: {
      fileSize: 10_000_000,
    },
  },
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: "media",
          generateFileURL: ({ filename: fname, prefix }) =>
            `${r2Endpoint}/${r2Bucket}/${prefix}/${fname}`,
        },
      },
      bucket: r2Bucket,
      config: {
        credentials: {
          accessKeyId: r2AccessKeyId,
          secretAccessKey: r2SecretAccessKey,
        },
        region: "auto",
        endpoint: r2Endpoint,
      },
    }),
  ],
});
