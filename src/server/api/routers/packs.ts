import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/nodejs";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export const packsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.pack.findMany();
  }),

  getById: publicProcedure.input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const pack = await ctx.prisma.pack.findUnique({
        where: { id: input.id },
        include: {
          packItems: true,
        },
      });
      if (!pack) throw new TRPCError({ code: "NOT_FOUND" });

      return pack;
    }),

  create: privateProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
        packItems: z.object({
          name: z.string().min(1).max(200)
        }).array().optional()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const pack = await ctx.prisma.pack.create({
        data: {
          authorId,
          name: input.name,
          packItems: {
            create: input.packItems,
          },
        },
      });
      return pack;
    }),
    
  editPack: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(200),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      try {
        await ctx.prisma.pack.update({
          where: { id: input.id, authorId: authorId },
          data: {
            authorId,
            name: input.name
          },
        });
      } catch (err) {
        console.log("DELETE ERROR: ", err);
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return "ok";
    }),

  editPackItem: privateProcedure
    .input(
      z.object({
        packId: z.string(),
        id: z.string(),
        name: z.string().min(1).max(200),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      try {
        await ctx.prisma.pack.update({
          where: { id: input.packId, authorId: authorId },
          data: {
            packItems: {
              update: {
                where: {
                  id: input.id,
                },
                data: {
                  name: input.name
                }
              }
            }
          },
          include: {
            packItems: true
          }
        });
      } catch (err) {
        console.log("DELETE ERROR: ", err);
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return "ok";
    }),
});
