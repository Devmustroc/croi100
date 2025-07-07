'use client'

import { z } from "zod"
import { useState } from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField} from "@/components/ui/form";
import TextareaAutosize from "react-textarea-autosize";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {ArrowRight, ArrowRightIcon, ArrowUpIcon, Loader2} from "lucide-react";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

interface Props {
  projectId: string;
}

const formSchema = z.object({
  value: z.string()
    .min(1, { message: "Message cannot be empty" })
    .max(10000, { message: "Message cannot be longer than 10000 characters" }),
});

export const MessageForm: React.FC<Props> = ({ projectId }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: '',
    }
  });

  const createmessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries(trpc.messages.getMany.queryOptions({ projectId }));
      // TODO: Invalidate usage Status
    },
    onError: (error) => {
      // TODO: Redirect to pricing page if user is not subscribed
      toast.error(error.message);
    }
  }))

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await createmessage.mutateAsync({
      value: data.value,
      projectId
    });
  };

  const [isFocused, setIsFocused] = useState(false);
  const showUsage = false
  const isPending = createmessage.isPending;
  const isDisabled = isPending || !form.formState.isValid || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('relative border p-4 pt-1 rounded-md bg-sidebar dark:bg-sidebar-dark transition-all',
          isFocused && "shadow-xs",
          showUsage && "rounded-t-none",
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutosize
              {...field}
              disabled={isPending}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type your message here..."
              className={cn(
                "w-full resize-none bg-transparent outline-none text-sm",
                "placeholder:text-muted-foreground",
                "focus:ring-0 focus:border-primary"
              )}
              minRows={1}
              maxRows={5}
              value={field.value}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (!e.shiftKey && !e.ctrlKey && !e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
            />
          )}
        />
        <div
          className="flex gap-x-2 items-end justify-between pt-2"
        >
          <div
            className="text-[10px] text-muted-foreground font-mono"
          >
            <kbd
              className="ml-auto pointer-events-none inline-flex items-center justify-center h-6 px-2 font-sans text-xs font-medium text-muted-foreground bg-muted rounded-sm shadow-sm"
            >
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded bg-muted text-muted-foreground",
                  isFocused && "bg-primary text-primary-foreground"
                )}
              >
                <span className="text-xs">Ctrl</span> + <span className="text-xs">Enter</span>
              </span>
            </kbd>{' '}
            &nbsp;to submit
          </div>
          <Button
            disabled={isDisabled}
            type="submit"
            className={cn("px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200"
              , isDisabled && "opacity-50 cursor-not-allowed")}
          >
            {
              isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRightIcon className="h-4 w-4" />
              )
            }
          </Button>
        </div>
      </form>

    </Form>
  )
}