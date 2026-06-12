import { NotFoundPage } from "@payloadcms/next/views";
import { importMap } from "../importMap";

type Args = {
  params: Promise<{ segments: string[] }>;
};

const NotFound = ({ params }: Args) =>
  NotFoundPage({ importMap, params });

export default NotFound;
