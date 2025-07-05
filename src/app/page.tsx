"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import React from "react";
import {useTRPC} from "@/trpc/client";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [value, setValue] = React.useState("");

  const trpc = useTRPC();
  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
    onSuccess: (result) => {
      toast.success("Project created successfully!");
      router.push(`/projects/${result.id}`);
    }
  }))
  return (
    <div
      className="h-screen w-screen flex itecem-center justify-center flex-col gap-4 p-4"
    >
      <div
        className="max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center"
      >
        <Input
          value={value}
          placeholder="Enter text to invoke function"
          className="mb-4"
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          disabled={createProject.isPending}
          onClick={() => createProject.mutate({ value: value })}
        >
          Create
        </Button>
      </div>
    </div>
  );
}

export default Page;
