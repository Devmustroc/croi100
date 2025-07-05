import {z} from "zod";
import {prisma} from "@/lib/db";
import {inngest} from "@/inngest/client";
import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import {generateSlug} from "random-word-slugs";

export const projectsRouter = createTRPCRouter({
  getMany: baseProcedure
    .query(async () => {
      return prisma.project.findMany({
        orderBy: {updatedAt: "desc"},
      });
    }),
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, { message: "Message cannot be empty" }).max(10000, { message: "Message cannot be longer than 10000 characters" }),
      })
    )
    .mutation(async ({ input }) => {

      const createdProject = await prisma.project.create({
        data: {
          name: generateSlug(2, {
            format: "kebab",
          }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            }
          }
        }
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject.id,
        }
      });

      return createdProject;
    }),
})