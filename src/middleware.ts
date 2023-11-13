import { authMiddleware } from "@clerk/nextjs";
// import { NextResponse } from "next/server";

export default authMiddleware({
  // ignoredRoutes:[
  // ],
  publicRoutes: [
    "/", 
    '/todo', 
    '/search', 
    '/pack/:id',
    "/api/trpc/(.*)",    
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
