import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { Users } from "@/payload/collections/Users";
import { Portfolios } from "@/payload/collections/Portfolios";
import { Blocks } from "@/payload/collections/Blocks";
import { Media } from "@/payload/collections/Media";
import { Todos } from "@/payload/collections/Todos";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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
  collections: [Users, Portfolios, Blocks, Media, Todos],
  editor: lexicalEditor(),
  secret: (() => {
    if (!process.env.PAYLOAD_SECRET) throw new Error("Missing PAYLOAD_SECRET env var");
    return process.env.PAYLOAD_SECRET;
  })(),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: (() => {
        if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL env var");
        return process.env.DATABASE_URL;
      })(),
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
            `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${prefix}/${fname}`,
        },
      },
      bucket: process.env.R2_BUCKET_NAME!,
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
        region: "auto",
        endpoint: process.env.R2_ENDPOINT,
      },
    }),
  ],
});
