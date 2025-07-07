import {useTRPC} from "@/trpc/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {ChevronDownIcon, ChevronLeftIcon, Moon, Sun, SunMoonIcon} from "lucide-react";
import Link from "next/link";
import {useTheme} from "next-themes";

interface Props {
  projectId: string;
}

export const ProjectHeader = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { data: project } = trpc.projects.getOne.queryOptions({
    id: projectId,
  });

  const { setTheme, theme } = useTheme();

  return (
    <header
      className="p-2 flex justify-between items-center border-b"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={"sm"}
            className="focus-visible:ring-0 hover:bg-transparent focus:bg-transparent active:bg-transparent text-sm font-medium text-clipboard-foreground flex items-center gap-2"
          >
            <Image src={project?.logo || "/logo-Without.svg"} alt={project?.name || "Project Logo"} height={24} width={24} className="shrink-0" />
            <span className="ml-2 text-sm font-medium">{project?.name || "Project"}</span>
            <ChevronDownIcon className="h-4 w-4 text-clipboard-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start">
          <DropdownMenuItem asChild>
            <Link
              href="/"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-2" />
              <span>Back to Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <SunMoonIcon className="h-4 w-4 mr-2" />
              <span className="ml-2 text-sm font-medium">Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={setTheme}
                >
                  <DropdownMenuRadioItem value="light" className="flex items-center gap-2">
                    <Sun className="h-4 w-4 mr-2" />
                    <span className="ml-2 text-sm font-medium">Light</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark" className="flex items-center gap-2">
                    <Moon className="h-4 w-4 mr-2" />
                    <span className="ml-2 text-sm font-medium">Dark</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system" className="flex items-center gap-2">
                    <SunMoonIcon className="h-4 w-4 mr-2" />
                    <span className="ml-2 text-sm font-medium">System</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>

      </DropdownMenu>
    </header>
  )
}