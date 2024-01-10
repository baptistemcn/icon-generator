/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import OpenAI from "openai";
import AWS from "aws-sdk";

import { env } from "~/env";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { b64Image } from "~/data/image";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: "us-east-1",
});

async function generateIcon(prompt: string): Promise<string | undefined> {
  if (env.MOCK_DALLE === "false") {
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    });
    return response.data[0]?.b64_json;
  } else {
    return b64Image;
  }
}

export const generateRouter = createTRPCRouter({
  generatIcon: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("we are here", input);

      const { count } = await ctx.db.user.updateMany({
        where: {
          id: ctx.session.user.id,
          credits: {
            gte: 1,
          },
        },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });

      if (count <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You do not have enough credits",
        });
      }

      const finalPrompt = input.prompt;

      const base64EncodedImages = await generateIcon(finalPrompt);

      await s3
        .putObject({
          Bucket: "icon-generator-baptistemcn",
          Body: Buffer.from(base64EncodedImages!, "base64"),
          Key: "my-image-png",
          ContentEncoding: "base64",
          ContentType: "image/png",
        })
        .promise();

      return {
        imageUrl: base64EncodedImages,
      };
    }),
});
