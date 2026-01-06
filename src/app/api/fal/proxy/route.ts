import { route } from "@fal-ai/server-proxy/nextjs";

// This tells Vercel to run this on the Edge Network
export const runtime = 'edge'; 

// Optional: Force dynamic to ensure no stale responses for AI generation
export const dynamic = 'force-dynamic';

export const { GET, POST } = route.configure({
  // Your existing credit validation logic here...
});
