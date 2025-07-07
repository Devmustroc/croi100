"use client";

import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {MessagesContainer} from "@/modules/projects/ui/components/messages-Container";
import {Suspense, useState} from "react";
import {Loader2} from "lucide-react";
import {Fragment} from "@/generated/prisma";
import {ProjectHeader} from "@/modules/projects/ui/components/project-header";

interface Props {
  projectId: string;
}

export const ProjectView: React.FC<Props> = ({ projectId }) => {
  const [activeFragement, setActiveFragment] = useState<Fragment | null>(null);

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
          <Suspense fallback={<Loader2 className="animate-spin"/>}>
            <ProjectHeader projectId={projectId}/>
          </Suspense>
          <Suspense fallback={<Loader2  className="animate-spin"/>}>
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragement}
              setActiveFragment={setActiveFragment}
            />
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