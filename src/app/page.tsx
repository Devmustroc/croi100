"use client";

import {Button} from "@/components/ui/button";
import {useTRPC} from "@/trpc/client";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";

const Page = () => {
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: (data) => {
      console.log("Function invoked successfully:", data);
      toast.success("Function invoked successfully", {
        description: `Response: ${JSON.stringify(data)}`,
      });
    },
    onError: (error) => {
      console.error("Error invoking function:", error);
      toast.error("Error invoking function", {
        description: `Error: ${error.message}`,
      });
    },
  }))
  return (
    <div
      className="p-4 max-w-7xl mx-auto"
    >
      <Button
        disabled={invoke.isPending}
        onClick={() => invoke.mutate({ text: "world mustapha" })}
      >
        Invoke Inngest Function
      </Button>
    </div>
  );
}

export default Page;
