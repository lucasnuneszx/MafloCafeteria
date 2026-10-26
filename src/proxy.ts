import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);
const isPublicAdminRoute = createRouteMatcher(["/admin/sign-in(.*)"]);

// Single-tenant admin: only these emails may ever reach /admin, regardless of
// how many accounts exist in the Clerk instance. This is the real access
// boundary — "is signed in" alone is not enough.
const ALLOWED_ADMIN_EMAILS = (process.env.ADMIN_ALLOWED_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req) || isPublicAdminRoute(req)) {
    return;
  }

  const { userId } = await auth.protect({
    unauthenticatedUrl: new URL("/admin/sign-in", req.url).toString(),
  });

  if (ALLOWED_ADMIN_EMAILS.length === 0) {
    // Misconfiguration: fail closed rather than let any signed-in user in.
    return NextResponse.redirect(new URL("/admin/sign-in?error=not_configured", req.url));
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.emailAddresses
    .find((e) => e.id === user.primaryEmailAddressId)
    ?.emailAddress?.toLowerCase();

  if (!email || !ALLOWED_ADMIN_EMAILS.includes(email)) {
    return NextResponse.redirect(new URL("/admin/sign-in?error=unauthorized", req.url));
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
