"use client";

import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {MessagesContainer} from "@/modules/projects/ui/components/messages-Container";
import { Suspense } from "react";
import {Loader2} from "lucide-react";

interface Props {
  projectId: string;
}

export const ProjectView: React.FC<Props> = ({ projectId }) => {
  const trpc = useTRPC();
  const { data: project} = useSuspenseQuery(trpc.projects.getOne.queryOptions({
    id: projectId,
  }))

  return (
    <div
      className="h-screen"
    >
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<Loader2  className="animate-spin"/>}>
            <MessagesContainer projectId={projectId} />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={65}
          minSize={50}
        >
          TODO: Preview
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}