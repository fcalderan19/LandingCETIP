import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIX = "/admin";
const LOGIN_PATH = "/admin/login";
const PUBLIC_ADMIN_PATHS = new Set([LOGIN_PATH, "/admin/login/verify"]);

const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Pass the pathname downstream so the admin layout can know which route
  // is rendering (RSC doesn't have access to the request URL otherwise).
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }
  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const hasSession = SESSION_COOKIES.some((name) => req.cookies.get(name));
  if (hasSession) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const url = req.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
