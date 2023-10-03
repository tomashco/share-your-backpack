import { authMiddleware } from "@clerk/nextjs";
// import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/api/trpc/posts.getAll", "/api/trpc/packs.getAll"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
