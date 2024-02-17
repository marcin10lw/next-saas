import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/auth-callback"];

export async function middleware(req: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (
    !user &&
    protectedRoutes.some((route) => req.nextUrl.pathname.includes(route))
  ) {
    const absoluteURL = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}
