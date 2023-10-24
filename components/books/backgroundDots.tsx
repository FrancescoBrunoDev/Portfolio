import { Circle } from "lucide-react";

export default function BackgroundDots() {
  return (
    // take this svg and make a grid with it as the background, so you have to create a pattern by it and then use it as a background

    <div
      id="backgorundDots"
      className="absolute grid h-full w-full grid-flow-row-dense grid-cols-1 gap-2"
    >
      {Array.from({ length: 13 }).map((_, index) => (
        <div key={index} className="flex w-full justify-between px-3 opacity-30">
          {Array.from({ length: 14 }).map((_, index) => (
            <Circle key={index} fill="hsl(var(--primary-foreground))" strokeWidth={0} width={3} />
          ))}
        </div>
      ))}
    </div>
  );
}
