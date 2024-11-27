import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BgLandingProps {
  mousePosition: MousePosition;
  windowDimensions: WindowDimensions;
}

export const BgLanding: React.FC<BgLandingProps> = ({
  mousePosition,
  windowDimensions,
}) => {
  const [randomNum, setRandomNum] = useState(0);
  const [direction, setDirection] = useState(0);
  const [desiredDirection, setDesiredDirection] = useState(
    getInitialDirection()
  );
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);

  // Imposta le dimensioni iniziali della finestra
  useEffect(() => {
    setWindowDimensions();
  }, []);

  // Aggiorna il numero casuale e la direzione
  useEffect(() => {
    const interval = setInterval(updateRandomNumAndDirection, 100);
    return () => clearInterval(interval);
  }, [direction, desiredDirection]);

  const dist = getDistanceFromCenter();
  const radius = getRadius(dist) ? getRadius(dist) : 0;
  const movement = getMovement(radius);

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-0 flex h-screen w-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <svg width={windowDimensions.width} height={windowDimensions.height}>
          <circle
            className="transition-all duration-100 ease-in-out"
            cx={getCircleX(movement)}
            cy={getCircleY(movement)}
            r={radius + randomNum}
            stroke="hsl(var(--primary))"
            strokeWidth={20}
            fill="transparent"
          />
        </svg>
      </motion.div>
    </div>
  );

  function getInitialDirection() {
    return Math.random() > 0.5 ? 1 : -1;
  }

  function setWindowDimensions() {
    setCenterX(window.innerWidth / 2);
    setCenterY(window.innerHeight / 2);
  }

  function updateRandomNumAndDirection() {
    setRandomNum((prevNum) => prevNum + direction * 0.1);
    if (Math.random() < 0.05) {
      setDesiredDirection((prevDirection) => -prevDirection);
    }
    setDirection(
      (prevDirection) =>
        prevDirection + (desiredDirection - prevDirection) * 0.1
    );
  }

  function getDistanceFromCenter() {
    return Math.sqrt(
      Math.pow(mousePosition.x - centerX, 2) +
        Math.pow(mousePosition.y - centerY, 2)
    );
  }

  function getRadius(dist: number): number {
    return Math.max(100, Math.min(150, 150 - (dist / centerX) * 5));
  }

  function getMovement(radius: number): number {
    return radius / 5000;
  }

  function getCircleX(movement: number): number {
    return (
      windowDimensions.width / 1.3 +
      movement * (mousePosition.x - centerX) +
      randomNum
    );
  }

  function getCircleY(movement: number): number {
    return (
      windowDimensions.height / 1.4 +
      movement * (mousePosition.y - centerY) +
      randomNum
    );
  }
};
