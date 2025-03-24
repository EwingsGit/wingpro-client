// src/components/common/WingProLogo.tsx
import React from "react";
// Import the logo wing symbol SVG for the icon-only version
import logoWingSymbol from "../../assets/logo.svg";
// For the full logo, we'll use the complete image with text
// Note: You would need to add this image to your assets folder
import fullLogo from "../../assets/full-logo.svg";

interface WingProLogoProps {
  size?: "small" | "medium" | "large";
  variant?: "full" | "symbol-only";
  showTagline?: boolean;
}

const WingProLogo: React.FC<WingProLogoProps> = ({
  size = "medium",
  variant = "full",
  showTagline = true,
}) => {
  // Define sizes for different variants
  const sizes = {
    small: {
      container: "flex items-center",
      logo: "h-8",
      symbol: "h-6 w-12 mr-2",
      text: "text-lg font-bold text-gray-800",
      tagline: "text-xs text-blue-400",
    },
    medium: {
      container: "flex items-center",
      logo: "h-12",
      symbol: "h-8 w-16 mr-2",
      text: "text-2xl font-bold text-gray-800",
      tagline: "text-sm text-blue-400",
    },
    large: {
      container: "flex items-center",
      logo: "h-16",
      symbol: "h-12 w-24 mr-3",
      text: "text-3xl font-bold text-gray-800",
      tagline: "text-base text-blue-400",
    },
  };

  const currentSize = sizes[size];

  if (variant === "symbol-only") {
    // Only show the wing symbol
    return (
      <div className={currentSize.container}>
        <img
          src={logoWingSymbol}
          alt="WingPro Logo Symbol"
          className={currentSize.symbol}
        />
        <div className="flex flex-col">
          <span className={currentSize.text}>WingPro</span>
          {showTagline && (
            <span className={currentSize.tagline}>thewingpro.com</span>
          )}
        </div>
      </div>
    );
  }

  // Show the full logo with text
  return (
    <div className={currentSize.container}>
      <img src={fullLogo} alt="WingPro Logo" className={currentSize.logo} />
      {/* We don't need to add the tagline separately since it's part of the full logo */}
    </div>
  );
};

export default WingProLogo;
