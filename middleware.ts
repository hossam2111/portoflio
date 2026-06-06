import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Admin routes that require authentication
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// Admin sign-in route (public, but under /admin path)
const isAdminSignIn = createRouteMatcher(["/admin/sign-in(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  // Admin sign-in page is accessible without auth
  if (isAdminSignIn(request)) {
    return NextResponse.next();
  }

  // Admin routes require authentication + admin whitelist
  if (isAdminRoute(request)) {
    const { userId } = await auth();

    if (!userId) {
      const signInUrl = new URL("/admin/sign-in", request.url);
      signInUrl.searchParams.set("redirect_url", request.url);
      return NextResponse.redirect(signInUrl);
    }

    // Check admin whitelist
    const adminIds = process.env.ADMIN_USER_IDS?.split(",").map((id) =>
      id.trim()
    );
    if (adminIds && adminIds.length > 0 && !adminIds.includes(userId)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // All other routes are public — no auth required
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
