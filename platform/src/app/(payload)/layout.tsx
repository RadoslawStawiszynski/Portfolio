// platform/src/app/(payload)/layout.tsx
// Payload CMS admin root layout — sets up RootProvider (ConfigProvider, ThemeProvider, etc.)
// Required for multiple root layouts pattern (Next.js App Router)
import configPromise from "@payload-config";
import "@payloadcms/next/css";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import type { ServerFunctionClient } from "payload";
import React from "react";
import { importMap } from "./admin/importMap";

type Args = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Args) => {
  const serverFunction: ServerFunctionClient = async function (args) {
    "use server";
    return handleServerFunctions({
      ...args,
      config: configPromise,
      importMap,
    });
  };

  return (
    <RootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
};

export default Layout;
