import {inngest} from "./client";
import {createAgent, createNetwork, createTool, openai, type Tool} from "@inngest/agent-kit";
import {z} from "zod";
import {Sandbox} from '@e2b/code-interpreter';
import {getSandbox, lastAssistantTextMessageContent} from "@/inngest/utils";
import {PROMPT} from "@/prompt";
import {prisma} from "@/lib/db";

interface AgentState {
  summary: string;
  files: {
    [path: string]: string;
  }
}


export const codeAgentFunction = inngest.createFunction(
  {id: "code-agent"},
  {event: "code-agent/run"},
  async ({event, step}) => {
    const sanboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("croi100-nextjs-test-2");
      return sandbox.sandboxId
    });

    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description: "An software engineer that can write code, run it in a sandbox, and read files.",
      system: PROMPT,
      model: openai({
        model: "openai/gpt-4.1",
        baseUrl: process.env.OPENAI_API_BASE,
        apiKey: process.env.OPENAI_API_KEY,
        defaultParameters: {
          temperature: 0.1,
        }
      }),
      tools: [
        createTool({
          name: 'terminal',
          description: "use the terminal to run commands",
          parameters: z.object({
            command: z.string()
          }),
          handler: async ({command}, {step}) => {
            return await step?.run('terminal', async () => {
              const buffers = {stdout: "", stderr: ""};

              try {
                const sandbox = await getSandbox(sanboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data.toString();
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data.toString();
                  }
                })

                return result.stdout;
              } catch (e) {
                buffers.stderr += e instanceof Error ? e.message : String(e);
                console.error("Error running command:", e);
                return buffers.stderr;
              }
            });
          },
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string().describe("The path of the file to create or update"),
                content: z.string().describe("The content of the file to create or update"),
              }),
            ),
          }),
          handler: async ({files}, {step, network}: Tool.Options<AgentState>) => {
            const newFiles = await step?.run("createOrUpdateFiles", async () => {
              try {
                const updatedFiles = network.state.data.files ?? {};
                const sanbox = await getSandbox(sanboxId);

                for (const file of files) {
                  await sanbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }

                return updatedFiles;
              } catch (e) {
                console.error("Error creating or updating files:", e);
                throw new Error(`Failed to create or update files: ${e instanceof Error ? e.message : String(e)}`);
              }
            })

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          }
        }),
        createTool({
          name: 'readFiles',
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()).describe("The paths of the files to read"),
          }),
          handler: async ({files}, {step}) => {
            return await step?.run('readFiles', async () => {
              try {
                const sandbox = await getSandbox(sanboxId);
                const contents = [];

                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({path: file, content});
                }

                return JSON.stringify(contents);
              } catch (e) {
                console.error("Error reading files:", e);
                throw new Error(`Failed to read files: ${e instanceof Error ? e.message : String(e)}`);
              }
            })
          }
        })
      ],
      lifecycle: {
        onResponse: async ({result, network}) => {
          const lastAssistantMessageText = lastAssistantTextMessageContent(result);

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText
            }
          }

          return result;
        }
      }
    });

    const network = createNetwork<AgentState>({
      name: 'code-agent-network',
      agents: [codeAgent],
      maxIter: 8,
      router: async ({network}) => {
        const summary = network.state.data.summary;

        if (summary) {
          return;
        }

        return codeAgent;
      }
    })

    const result = await network.run(event.data.value);

    const isError = !result.state.data.summary
    || Object.keys(result.state.data.files ?? {}).length === 0;

    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      const sandbox = await getSandbox(sanboxId);

      const host = sandbox.getHost(3000);

      return `https//${host}`;
    });

    await step.run('save-result', async () => {
      if (isError) {
        return prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "An error occurred while processing your request.",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }
      return prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: result.state.data.summary,
          role: "ASSISTANT",
          type: "RESULT",
          fragments: {
            create: {
              sandboxUrl: sandboxUrl,
              title: "Fragment of code",
              files: result.state.data.files,
            }
          }
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "Fragment of code",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  },
);
