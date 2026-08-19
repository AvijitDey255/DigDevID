// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export async function proxy(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   const token = req.cookies.get("token")?.value;

//   // Public API routes
//   if (
//     pathname.startsWith("/api/auth") ||
//     pathname.startsWith("/otp")
//   ) {
//     return NextResponse.next();
//   }

//   // Auth page
//   if (pathname === "/auth") {
//     if (!token) {
//       return NextResponse.next();
//     }

//     try {
//       jwt.verify(token, process.env.JWT_SECRET!);

//       // Already logged in → go home
//       return NextResponse.redirect(new URL("/", req.url));

//     } catch {
//       const response = NextResponse.next();

//       response.cookies.delete("token");

//       return response;
//     }
//   }

//   // Protected routes
//   if (!token) {
//     const loginUrl = new URL("/auth", req.url);

//     loginUrl.searchParams.set("callbackUrl", req.url);

//     return NextResponse.redirect(loginUrl);
//   }

//   try {
//     jwt.verify(token, process.env.JWT_SECRET!);

//     return NextResponse.next();

//   } catch {
//     const loginUrl = new URL("/auth", req.url);

//     const response = NextResponse.redirect(loginUrl);

//     response.cookies.delete("token");

//     return response;
//   }
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };


import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;

  // =====================================================
  // PUBLIC API ROUTES
  // =====================================================
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/user/find") ||
    pathname.startsWith("/otp")
  ) {
    return NextResponse.next();
  }

  // =====================================================
  // PUBLIC USER PROFILE
  // /user/avijit123        -> PUBLIC
  // /user/avijit123/test   -> PROTECTED
  // =====================================================
  const userPath = pathname.match(/^\/user\/[^/]+$/);

  if (userPath) {
    return NextResponse.next();
  }

  // =====================================================
  // AUTH PAGE
  // =====================================================
  if (pathname === "/auth") {
    if (!token) {
      return NextResponse.next();
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);

      return NextResponse.redirect(new URL("/", req.url));
    } catch {
      const response = NextResponse.next();

      response.cookies.delete("token");

      return response;
    }
  }

  // =====================================================
  // PROTECTED ROUTES
  // =====================================================
  if (!token) {
    const loginUrl = new URL("/auth", req.url);

    loginUrl.searchParams.set("callbackUrl", req.url);

    return NextResponse.redirect(loginUrl);
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/auth", req.url);

    const response = NextResponse.redirect(loginUrl);

    response.cookies.delete("token");

    return response;
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};