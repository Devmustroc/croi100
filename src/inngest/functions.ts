import { inngest } from "./client";
import {
  openai,
  createAgent
} from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-mustapha" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert summarizer.  You summarize in 2 words.",
      model: openai({ model: "openai/gpt-4.1-mini", baseUrl: process.env.OPENAI_API_BASE , apiKey: process.env.OPENAI_API_KEY! }),
    });



    const { output } = await codeAgent.run(
      `Summarize this text in 2 words: ${event.data.email},`,
    );
    console.log(output);

    return { output };
  },
);
