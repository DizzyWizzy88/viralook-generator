export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Ensure it uses Node instead of Edge

import { route } from "@fal-ai/server-proxy/nextjs";

export const { GET, POST } = route;
