interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>
}

const Page = async({ params }: ProjectPageProps) => {
  const { projectId } = await params;
  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col gap-4 p-4">
      <div className="max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center">
        <h1 className="text-2xl font-bold">Project Page {projectId}</h1>
        <p className="text-lg">This is the project page for a specific project.</p>
      </div>
    </div>
  );
}
export default Page;