import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const teamsRouter = createTRPCRouter({
  create: privateProcedure
    // .input(
    //   z.object({
    //     content: z.string().min(1).max(200),
    //   }),
    // )user_2VbbP7vQtDmMwpqju0YLxeyVoBm
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const team = await ctx.prisma.team.create({
        data: {
          name: "New team",
          authorId,
          members: {
            create: {
              email: "alice@prisma.io",
            },
          },
        },
      });
      return team;
    }),
});
