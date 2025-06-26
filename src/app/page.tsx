
import {getQueryClient, trpc} from "@/trpc/server";

export default function Home() {

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.createAi.queryOptions({ text: "Hello, Next.js!" }));
  return (
    <div>
      Hello, Next.js!
    </div>
  );
}
