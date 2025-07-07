import {Fragment, MessageRole, MessageType} from "@/generated/prisma";
import { Poppins } from "next/font/google";
import {Card} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import Image from "next/image";
import { format } from "date-fns";
import {ChevronRightIcon, Code2Icon} from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500"],
});

interface UserMessageProps {
  content: string;
}

interface AssistantMessageProps {
  content: string;
  fragments: Fragment | null;
  createdAt: Date;
  isActive?: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
}

interface MessageCardProps {
  content: string;
  role: MessageRole;
  fragments: Fragment | null;
  createdAt: Date;
  isActive?: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
}

interface FragmentCardProps {
  fragments: Fragment;
  isActive: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}


const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div
      className="flex justify-end pb-4 pr-2 pl-10"
    >
      <Card
        className="bg-primary p-3 shadow-none border-none max-w-[80%] text-sm rounded-l-2xl rounded-r text-white"
      >
        {content}
      </Card>
    </div>
  )
}

const FragmentCard = ({
  fragments,
  isActive,
  onFragmentClick
}: FragmentCardProps) => {

  return (
    <button
      className={cn(
        `flex items-start text-start gap-2 border-primary bg-primary w-fit p-3 hover:bg-primary/50 transition-colors duration-200 hover:text-black text-sm rounded-l rounded-r-2xl`,
        isActive && "bg-primary text-primary-foreground border-primary hover:bg-orange-500 hover:text-orange-700",
      )}
      onClick={() => onFragmentClick(fragments)}
    >
      <Code2Icon className="h-4 w-4 text-primary-foreground" />
      <div
        className="flex flex-col flex-1"
      >
        <span
          className="text-sm font-medium line-clamp-1 text-primary-foreground"
        >
          {fragments.title}
        </span>
        <span
          className="text-xs text-primary-foreground/80 line-clamp-2"
        >
          Preview
        </span>
      </div>
      <div
        className="flex items-center justify-center text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </div>
    </button>
  )
}


const AssistantMessage = ({
  content,
  fragments,
  createdAt,
  isActive = false,
  onFragmentClick,
  type
} : AssistantMessageProps) => {
  return (
    <div
      className={cn(
        "flex flex-col group px-2 pb-4",
        type === "ERROR" && "text-red-700 dark:text-red-500",
      )}
    >
      <div
        className="flex items-center gap-2 pl-2 mb-2"
      >
        { /* LOGO */ }
        <Image src={"/logo-Without.svg"} alt={"croi100"} height={18} width={18} className="shrink-0"/>
        <span
          className={cn(`text-sm font-semibold, ${poppins.className}`)}
        >Croi100</span>
        <span
          className="text-sm text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        >
          {format(createdAt, "HH:mm 'on' dd/MM/yyyy")}
        </span>
      </div>
      <div
        className="pl-8.5 flex flex-col gap-y-4"
      >
        <span>{content}</span>
        {fragments && type === "RESULT" && (
          <FragmentCard
            fragments={fragments}
            isActive={isActive}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  )
}


export const MessageCard = (
  { content,
    role,
    fragments,
    createdAt,
    isActive = false,
    onFragmentClick,
    type
  }: MessageCardProps
) => {
  if (role === "ASSISTANT") {
    return (
      <AssistantMessage
        content={content}
        fragments={fragments}
        createdAt={createdAt}
        isActive={isActive}
        onFragmentClick={onFragmentClick}
        type={type}
      />
    )
  }

  return (
    <UserMessage
      content={content}
    />
  )

};