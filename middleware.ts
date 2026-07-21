import { NextRequest, NextResponse } from "next/server";
import { AuthRoutes } from "./route_config/authRouts"

export function middleware(req: NextRequest) {
  // const session = req.cookies.get("connect.sid")?.value;
  const pathname = req.nextUrl.pathname;
  console.log("Path:", req.nextUrl.pathname);

  console.log(
    "All Cookies:",
    req.cookies.getAll()
  );

  const session = req.cookies.get("connect.sid");

  console.log("Session:", session);

  // Agar login page ("/") par hai aur session hai
  if (pathname === "/") {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Check karo ki current route protected hai ya nahi
  const isProtected = Object.keys(AuthRoutes).some((route) =>
    pathname.startsWith(route)
  );

  // Agar protected route hai aur session nahi hai
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