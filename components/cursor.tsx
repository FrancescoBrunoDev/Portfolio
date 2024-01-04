"use client";

import { useEffect, useState } from "react";

const Cursor: React.FC = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);

  function moveCursor(cursor: HTMLElement) {
    return (e: MouseEvent) => {
      cursor.style.top = `${e.pageY}px`;
      cursor.style.left = `${e.pageX}px`;
    };
  }

  useEffect(() => {
    if (!isTouchDevice) {
      const cursor = document.querySelector(".circle-cursor") as HTMLElement;

      if (cursor) {
        const handleMouseMove = moveCursor(cursor);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
          window.removeEventListener("mousemove", handleMouseMove);
        };
      }
    }
  }, [isTouchDevice]);

  if (!isTouchDevice) {
    return <div className="circle-cursor pointer-events-none absolute z-50 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary mix-blend-multiply"/>
  } else {
    return null;
  }
};

export default Cursor;
