export default function BackgroundGridPattern() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  );
}
