"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import React from "react";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQuery} from "@tanstack/react-query";
import {toast} from "sonner";

const Page = () => {

  const [value, setValue] = React.useState("");

  const trpc = useTRPC();
  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: (data) => {
      console.log("Function invoked successfully:", data);
      toast.success("Function invoked successfully");
    },
    onError: (error) => {
      console.error("Error invoking function:", error);
      toast.error("Error invoking function");
    },
  }))
  return (
    <div
      className="p-4 max-w-7xl mx-auto"
    >
      <Input
        value={value}
        placeholder="Enter text to invoke function"
        className="mb-4"
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        disabled={createMessage.isPending}
        onClick={() => createMessage.mutate({ value: value })}
      >
        Invoke Inngest Function
      </Button>
      {JSON.stringify(messages, null, 4)}
    </div>
  );
}

export default Page;
