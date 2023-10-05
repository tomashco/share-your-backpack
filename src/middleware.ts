import { authMiddleware } from "@clerk/nextjs";
// import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/", 
    '/todo', 
    "/api/trpc/posts.getAll", 
    "/api/trpc/packs.getAll",
    "/api/trpc/packs.getById",
    '/pack/(.*)'
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
