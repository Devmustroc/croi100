'use client';

import {useEffect, useState} from "react";
import Image from "next/image";

const ShimmerMessagers = () => {
  const messages = [
    "Thinking...",
    "Loading...",
    "Generating response...",
    "Analyzing your request...",
    "Building your project...",
    "Crafting components...",
    "Optimizing your code...",
    "Optimizing layout...",
    "Preparing your project...",
    "Adding finishing touches...",
    "Finalizing your project...",
    "Almost there...",
    "Just a moment...",
    "Hang tight...",
    "Getting things ready...",
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(
        (prev) => (prev + 1) % messages.length
      );
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  })

  return (
    <div
      className="flex items-center gap-2"
    >
      <span
        className="text-base text-muted-foreground animate-pulse"
      >
        {messages[currentMessage]}
      </span>
    </div>
  )
}

export const LastMessageLoading = () => {
  return (
    <div
      className="flex flex-col group px-2 pb-4"
    >
      <div
        className="flex items-center gap-2 pl-2 mb-2"
      >
        <Image src={"/logo-Without.svg"} alt={"croi100"} height={18} width={18} className="shrink-0"/>
      </div>
      <div
        className="pl-8.5 flex flex-col gap-y-4"
      >
        <ShimmerMessagers />
      </div>
    </div>
  )

}