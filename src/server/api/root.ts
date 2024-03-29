import { postRouter } from "~/server/api/routers/post";
import { generateRouter } from "~/server/api/routers/generate";
import { createTRPCRouter } from "~/server/api/trpc";
import { checkoutRouter } from "./routers/checkout";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  generate: generateRouter,
  checkout: checkoutRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
