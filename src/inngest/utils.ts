import { Sandbox } from '@e2b/code-interpreter';
import {AgentResult, TextMessage} from "@inngest/agent-kit";

export async function getSandbox(sandboxId: string) {
  if (!sandboxId) {
    console.error("getSandbox appelé avec un ID de sandbox vide");
    throw new Error("ID de sandbox requis");
  }

  try {
    return await Sandbox.connect(sandboxId);
  } catch (error) {
    console.error(`Erreur de connexion au sandbox ${sandboxId}:`, error);
    throw new Error(`Échec de connexion au sandbox: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function lastAssistantTextMessageContent(result: AgentResult) {
  if (!result || !result.output || !Array.isArray(result.output)) {
    console.warn("Format de résultat invalide dans lastAssistantTextMessageContent");
    return undefined;
  }

  const lastAssistantMessageIndex = result.output.findLastIndex(
    (message) => message && message.role === "assistant",
  );

  if (lastAssistantMessageIndex === -1) {
    return undefined;
  }

  const message = result.output[lastAssistantMessageIndex] as TextMessage | undefined;

  if (!message || !message.content) {
    return undefined;
  }

  return typeof message.content === "string"
    ? message.content
    : Array.isArray(message.content)
      ? message.content.map((c) => c.text || "").join("")
      : undefined;
}