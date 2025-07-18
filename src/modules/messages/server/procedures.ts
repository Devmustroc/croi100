import {z} from "zod";
import {prisma} from "@/lib/db";
import {inngest} from "@/inngest/client";
import {baseProcedure, createTRPCRouter} from "@/trpc/init";

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .query(async ({ input }) => {
      return prisma.message.findMany({
        where: { projectId: input.projectId },
        include: {
          fragments: true,
        },
        orderBy: {updatedAt: "asc"},
      });
    }),
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, { message: "Message cannot be empty" })
          .max(10000, { message: "Message cannot be longer than 10000 characters" }),
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .mutation(async ({ input }) => {
      const newMessage = await prisma.message.create({
        data: {
          projectId: input.projectId,
          content: input.value,
          role: "USER",
          type: "RESULT",
        }
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: input.projectId,
        }
      });

      return newMessage;
    }),
})