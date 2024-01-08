import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const generateRouter = createTRPCRouter({
  generatIcon: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
      }),
    )
    .mutation(({ input }) => {
      console.log("we are here", input);
      return {
        message: "success",
      };
    }),
});
