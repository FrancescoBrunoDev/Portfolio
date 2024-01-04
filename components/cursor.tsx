"use client";

import { useEffect } from "react";

const Cursor: React.FC = () => {
  useEffect(() => {
    // Check if the device is not a touch device
    if (!('ontouchstart' in window)) {
      const cursor = document.querySelector(".circle-cursor") as HTMLElement;

      const moveCursor = (e: MouseEvent) => {
        if (cursor) {
          cursor.style.top = `${e.pageY}px`;
          cursor.style.left = `${e.pageX}px`;
        }
      };

      window.addEventListener("mousemove", moveCursor);

      return () => {
        window.removeEventListener("mousemove", moveCursor);
      };
    }
  }, []);

  return (
    <div className="circle-cursor pointer-events-none absolute z-50 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary mix-blend-multiply"/>
  );
};

export default Cursor;
