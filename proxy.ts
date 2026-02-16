import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/backend", "/api/admin"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!isProtected) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: {
        "WWW-Authenticate": "Basic realm=\"Alma Natura Admin\"",
      },
    });
  }

  const base64 = authHeader.split(" ")[1];
  const [user, pass] = Buffer.from(base64, "base64").toString().split(":");

  if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASSWORD) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": "Basic realm=\"Alma Natura Admin\"",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/backend/:path*", "/api/admin/:path*"],
};
