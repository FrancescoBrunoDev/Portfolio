export default function BackgroundDots() {
  return (
    <div
      id="backgroundDots"
      className="absolute h-full w-full opacity-30"
      style={{
        backgroundImage:
          "radial-gradient(hsl(var(--primary-foreground)) 1.5px, transparent 1.5px)",
        backgroundSize: "22px 22px",
      }}
    />
  );
}
