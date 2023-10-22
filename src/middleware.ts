import { authMiddleware } from "@clerk/nextjs";
// import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/", 
    '/todo', 
    '/search', 
    "/api/trpc/packs.getAll,s3.getObjects",
    "/api/trpc/packs.getAll",
    "/api/trpc/packs.getById",
    "/api/trpc/packs.search", 
    '/pack/(.*)'
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
