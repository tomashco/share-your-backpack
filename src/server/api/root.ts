import { postsRouter } from "@/server/api/routers/posts";
import { packsRouter } from "@/server/api/routers/packs";
import { createTRPCRouter } from "@/server/api/trpc";
import { s3Router } from "./routers/s3";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  packs: packsRouter,
  s3: s3Router
});

// export type definition of API
export type AppRouter = typeof appRouter;
