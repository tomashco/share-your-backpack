import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import SuperJSON from "superjson";
import { S3 } from "@aws-sdk/client-s3";

export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null, s3: new S3 },
    transformer: SuperJSON,
  });
