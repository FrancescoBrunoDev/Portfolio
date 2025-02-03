"use client";

import { useState, useEffect } from "react";
import AnimatedCursor from "react-animated-cursor";

export default function AnimatedCursorWrapper() {
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  if (isTouchDevice) return null;

  return <AnimatedCursor innerSize={32} outerSize={0} trailingSpeed={3} />;
}
