import {z} from "zod";
import {prisma} from "@/lib/db";
import {inngest} from "@/inngest/client";
import {baseProcedure, createTRPCRouter} from "@/trpc/init";

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure
    .query(async () => {
      return prisma.message.findMany({
        orderBy: {updatedAt: "desc"},
      });
    }),
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, { message: "Message cannot be empty" }),
      })
    )
    .mutation(async ({ input }) => {
      const newMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: "USER",
          type: "RESULT",
        }
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
        }
      });

      return newMessage;
    }),
})