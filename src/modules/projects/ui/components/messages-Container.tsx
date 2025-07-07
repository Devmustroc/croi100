"use client";


import {useSuspenseQuery} from "@tanstack/react-query";
import {useTRPC} from "@/trpc/client";
import {MessageCard} from "@/modules/projects/ui/components/message-card";
import {MessageForm} from "@/modules/projects/ui/components/message-form";
import {useEffect, useRef} from "react";

interface Props {
  projectId: string;
}

export const MessagesContainer = ({ projectId }: Props) => {
  const buttomRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({
    projectId: projectId, // Assuming projectId is available in the scope
  }));

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.role === 'ASSISTANT'
    );

    if (lastAssistantMessage && buttomRef.current) {
      buttomRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [messages]);
  return (
    <div
      className="flex flex-col flex-1 min-h-0"
    >
      <div
        className="flex-1 min-h-0 overflow-y-auto"
      >
        <div
          className="pt-2 pr-1"
        >
          {
            messages.map((message) => (
              <MessageCard
                key={message.id}
                content={message.content}
                role={message.role}
                fragments={message.fragments}
                createdAt={message.createdAt}
                isActive={false} // Assuming isActive is not used here, set to false
                onFragmentClick={() => {}}
                type={message.type}
              />
            ))
          }
          <div ref={buttomRef}/>
        </div>
      </div>
      <div
        className="relative p-3 pt-1"
      >
        <div
          className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/80 pointer-events-none"
        ></div>
        <MessageForm projectId={projectId} />
      </div>

    </div>
  )
}