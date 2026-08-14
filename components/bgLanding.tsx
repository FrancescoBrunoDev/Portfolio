import { memo, useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";

interface BgLandingProps {
  mouseRef: { current: MousePosition };
  windowDimensions: WindowDimensions;
}

export const BgLanding = memo<BgLandingProps>(
  ({ mouseRef, windowDimensions }) => {
    const circleRef = useRef<SVGCircleElement>(null);
    const directionRef = useRef(0);
    const desiredDirectionRef = useRef(Math.random() > 0.5 ? 1 : -1);
    const randomRef = useRef(0);
    const displayRef = useRef({ x: 0, y: 0, r: 0 });
    const lastTimeRef = useRef(0);

    // Scrive cx/cy/r direttamente sul DOM via rAF: zero re-render di React
    useAnimationFrame((time) => {
      const circle = circleRef.current;
      if (!circle) return;

      const { width, height } = windowDimensions;
      if (width === 0 || height === 0) return;

      const delta = time - lastTimeRef.current;
      // Random walk: direzione aggiornata solo ogni ~150ms
      if (delta >= 150) {
        lastTimeRef.current = time;
        if (Math.random() < 0.05) {
          desiredDirectionRef.current = -desiredDirectionRef.current;
        }
        directionRef.current =
          directionRef.current +
          (desiredDirectionRef.current - directionRef.current) * 0.1;
        randomRef.current += directionRef.current * 0.1;
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const mouse = mouseRef.current;
      const dist = Math.sqrt(
        Math.pow(mouse.x - centerX, 2) + Math.pow(mouse.y - centerY, 2),
      );

      const radius = Math.max(
        100,
        Math.min(150, 150 - (dist / centerX) * 5),
      );
      const movement = radius / 7500;

      const targetX =
        width / 1.3 + movement * (mouse.x - centerX) + randomRef.current;
      const targetY =
        height / 1.4 + movement * (mouse.y - centerY) + randomRef.current;
      const targetR = radius + randomRef.current;

      // Lerp verso il target ogni frame: smoothness senza spring/re-render
      displayRef.current.x += (targetX - displayRef.current.x) * 0.2;
      displayRef.current.y += (targetY - displayRef.current.y) * 0.2;
      displayRef.current.r += (targetR - displayRef.current.r) * 0.2;

      circle.setAttribute("cx", String(displayRef.current.x));
      circle.setAttribute("cy", String(displayRef.current.y));
      circle.setAttribute("r", String(displayRef.current.r));
    });

    // Guard: niente da renderizzare finché le dimensioni non sono note
    if (windowDimensions.width === 0 || windowDimensions.height === 0) {
      return <div className="absolute inset-0 z-0" />;
    }

    return (
      <div className="absolute top-0 right-0 bottom-0 left-0 z-0 flex h-screen w-full items-center justify-center">
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
            <circle
              ref={circleRef}
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
