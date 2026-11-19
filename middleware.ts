import { NextRequest, NextResponse } from "next/server";
import { AuthRoutes } from "./route_config/authRouts"

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const session = req.cookies.get("auth_token");

  if (pathname === "/") { 
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  const isProtected = Object.keys(AuthRoutes).some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};

// import { NextRequest, NextResponse } from "next/server";
// import { AuthRoutes } from "../route_config/authRouts";

// export function middleware(req: NextRequest) {
//  const session = req.cookies.get("connect.sid")?.value;

//   const pathname = req.nextUrl.pathname;

//   // Login page
//   if (pathname === "/") {
//     if (session) {
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }
//     return NextResponse.next();
//   }

//   // Protected routes
//   if (AuthRoutes[pathname] && !session) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next|api|favicon.ico).*)"],
// };