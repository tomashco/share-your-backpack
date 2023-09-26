import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const packsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.pack.findMany();
  }),
  create: privateProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const pack = await ctx.prisma.pack.create({
        data: {
          authorId,
          name: input.name,
          packItems: {
            create: [
              {
                name: "element 1",
                categories: {
                  create: [
                    {
                      name: "category 1",
                    },
                  ],
                },
              },
              {
                name: "element 2",
              },
              {
                name: "a pillow",
              },
            ],
          },
        },
      });
      return pack;
    }),
});
