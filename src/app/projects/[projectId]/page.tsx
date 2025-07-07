import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {ProjectView} from "@/modules/projects/ui/views/project-view";
import {Suspense} from "react";
import {Loader2} from "lucide-react";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>
}

const Page = async({ params }: ProjectPageProps) => {
  const { projectId } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.messages.getMany.queryOptions({
    projectId: projectId,
  }));

  void queryClient.prefetchQuery(trpc.projects.getOne.queryOptions({
    id: projectId,
  }));

  return (
    <HydrationBoundary
      state={dehydrate(queryClient)}
    >
      <Suspense fallback={<Loader2 className="animate-spin h-6 w-6 text-gray-500" />}>
        <ProjectView projectId={projectId} />
      </Suspense>

    </HydrationBoundary>
  );
}
export default Page;