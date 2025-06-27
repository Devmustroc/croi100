import { inngest } from "./client";
import {
  openai,
  createAgent
} from "@inngest/agent-kit";
import { Sandbox } from '@e2b/code-interpreter';
import {getSandbox} from "@/inngest/utils";



export const helloWorld = inngest.createFunction(
  { id: "hello-mustapha" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sanboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("croi100-nextjs-test-2");
      return sandbox.sandboxId
    });

    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert summarizer.  You summarize in 2 words.",
      model: openai({ model: "openai/gpt-4.1-mini", baseUrl: process.env.OPENAI_API_BASE , apiKey: process.env.OPENAI_API_KEY! }),
    });

    const { output } = await codeAgent.run(
      `Summarize this text in 2 words: ${event.data.email},`,
    );

    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      const sandbox = await getSandbox(sanboxId);

      const host = sandbox.getHost(3000);

      return `https//${host}`;
    })

    return { output, sandboxUrl };
  },
);
