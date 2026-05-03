import { memo, useState, useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";

interface BgLandingProps {
  mousePosition: MousePosition;
  windowDimensions: WindowDimensions;
}

export const BgLanding = memo<BgLandingProps>(
  ({ mousePosition, windowDimensions }) => {
    const [randomNum, setRandomNum] = useState(0);
    const directionRef = useRef(0);
    const desiredDirectionRef = useRef(0);
    const lastTimeRef = useRef(0);

    // Init sicuro lato client (SSR-safe)
    if (typeof window !== "undefined" && desiredDirectionRef.current === 0) {
      desiredDirectionRef.current = Math.random() > 0.5 ? 1 : -1;
    }

    // Oscillazione via rAF invece di setInterval: sincronizzato col paint del browser
    useAnimationFrame((time) => {
      const delta = time - lastTimeRef.current;
      // ~150ms tra un tick e l'altro
      if (delta < 150) return;
      lastTimeRef.current = time;

      setRandomNum((prev) => {
        const dir = directionRef.current;
        if (Math.random() < 0.05) {
          desiredDirectionRef.current = -desiredDirectionRef.current;
        }
        directionRef.current =
          dir + (desiredDirectionRef.current - dir) * 0.1;
        return prev + dir * 0.1;
      });
    });

    // Derivato da windowDimensions (già SSR-safe dal parent)
    const centerX = windowDimensions.width / 2;
    const centerY = windowDimensions.height / 2;

    // Guard: niente da renderizzare finché le dimensioni non sono note
    if (centerX === 0 || centerY === 0) {
      return <div className="absolute inset-0 z-0" />;
    }

    const dist = Math.sqrt(
      Math.pow(mousePosition.x - centerX, 2) +
        Math.pow(mousePosition.y - centerY, 2),
    );

    const radius = Math.max(
      100,
      Math.min(150, 150 - (dist / (centerX || 1)) * 5),
    );
    const movement = radius / 7500;

    const circleX =
      windowDimensions.width / 1.3 +
      movement * (mousePosition.x - centerX) +
      randomNum;

    const circleY =
      windowDimensions.height / 1.4 +
      movement * (mousePosition.y - centerY) +
      randomNum;

    return (
      <div className="absolute top-0 right-0 bottom-0 left-0 z-0 flex h-screen w-screen items-center justify-center will-change-transform">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          style={{ willChange: "transform" }}
        >
          <svg
            width={windowDimensions.width}
            height={windowDimensions.height}
            style={{
              transform: "translateZ(0)",
              willChange: "transform",
            }}
          >
            <motion.circle
              animate={{ cx: circleX, cy: circleY, r: radius + randomNum }}
              transition={{ type: "spring", stiffness: 120, damping: 14, mass: 0.5 }}
              stroke="hsl(var(--primary))"
              strokeWidth={20}
              fill="transparent"
            />
          </svg>
        </motion.div>
      </div>
    );
  },
);

BgLanding.displayName = "BgLanding";
