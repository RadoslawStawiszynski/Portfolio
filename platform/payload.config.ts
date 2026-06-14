import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { Users } from "@/payload/collections/Users";
import { Portfolios } from "@/payload/collections/Portfolios";
import { Blocks } from "@/payload/collections/Blocks";
import { Media } from "@/payload/collections/Media";
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
  },
  collections: [Users, Portfolios, Blocks, Media],
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
  upload: {
    limits: {
      fileSize: 10_000_000,
    },
  },
});
