import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

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
});
