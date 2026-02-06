// src/lib/server/authUtils.ts (Safe for Static Builds)
import { NextRequest } from 'next/server';

/**
 * Note: For Capacitor/Static Export, Server Admin functions 
 * are usually handled by external Cloud Functions or a separate API.
 */
export async function verifySession(req: NextRequest) {
  // In a static 'export' build, this function can't run on-device.
  // We return null to prevent the build from crashing.
  return null; 
}
