import { NextRequest, NextResponse } from "next/server";

const SIGN_IN_PATH = "/admin/sign-in";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except sign-in) and /api/admin routes (except auth)
  const isAdminPage = pathname.startsWith("/admin") && !pathname.startsWith(SIGN_IN_PATH);
  const isAdminApi = pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const session = request.cookies.get("admin_session")?.value;
  const adminSecret = process.env.ADMIN_SECRET_TOKEN;

  if (!session || !adminSecret || session !== adminSecret) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const signInUrl = new URL(SIGN_IN_PATH, request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
