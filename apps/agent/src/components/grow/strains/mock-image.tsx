export const MockImage = ({
  _src,
  alt,
  fill,
  className,
}: {
  _src: string;
  alt: string;
  fill: boolean;
  className: string;
}) => {
  // Get a consistent color based on the alt text (strain name)
  const getColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate hue (0-360), saturation (40-80%), lightness (20-70%)
    const h = hash % 360;
    const s = 40 + (hash % 40);
    const l = 20 + (hash % 50);

    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  // Map strain names to distinctive appearances
  const getStrainAppearance = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("purple"))
      return "linear-gradient(to bottom right, #9561e2, #6d28d9)";
    if (lowerName.includes("blue"))
      return "linear-gradient(to bottom right, #3b82f6, #1e40af)";
    if (lowerName.includes("white"))
      return "linear-gradient(to bottom right, #e5e7eb, #9ca3af)";
    if (lowerName.includes("northern"))
      return "linear-gradient(to bottom right, #10b981, #047857)";
    if (lowerName.includes("girl scout") || lowerName.includes("gsc"))
      return "linear-gradient(to bottom right, #f59e0b, #92400e)";

    // Default to a generated color based on strain name
    return `linear-gradient(to bottom right, ${getColorFromString(name)}, ${getColorFromString(name + "123")})`;
  };

  const bgStyle = {
    background: getStrainAppearance(alt),
    backgroundSize: "cover",
    position: fill ? ("absolute" as const) : ("relative" as const),
    width: fill ? "100%" : "400px",
    height: fill ? "100%" : "320px",
  };

  // Create a placeholder with a distinctive color pattern for each strain
  return (
    <div style={bgStyle} className={className}>
      <div className="absolute inset-0 overflow-hidden">
        {/* Add a pattern overlay for texture */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="smallGrid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>
      </div>
    </div>
  );
};
