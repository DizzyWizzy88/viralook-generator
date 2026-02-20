import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// This tells the app that everything inside /dashboard 
// needs a logged-in user.
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // This complex line ensures Clerk doesn't run on your 
    // images, CSS, or internal Next.js files (speeds things up!)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
