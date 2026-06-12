// Singleton pino logger. Import everywhere instead of console.log.
// Dev: pretty-printed with colors via pino-pretty
// Prod: JSON → Vercel log drains
//
// Install deps after Next.js scaffold:
//   npm install pino pino-pretty
import pino from "pino";

const isDev = process.env.NODE_ENV === "development";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isDev ? "debug" : "info"),
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  }),
});

export type Logger = typeof logger;
