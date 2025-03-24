// src/components/common/WingProLogo.tsx
import React from "react";

interface WingProLogoProps {
  width?: number;
  height?: number;
  showText?: boolean;
  showDomain?: boolean;
  className?: string;
}

const WingProLogo: React.FC<WingProLogoProps> = ({
  width = 40,
  height = 40,
  showText = true,
  showDomain = false,
  className = "",
}) => {
  return (
    <div className={`flex ${showText ? "items-center" : ""} ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 250 250"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <path
          d="M186.518 120.056L114.536 77.5607L42.5534 120.056L114.536 162.551L186.518 120.056Z"
          fill="#1976D2"
        />
        <path
          d="M114.536 35.0654L42.5534 77.5607L114.536 120.056L186.518 77.5607L114.536 35.0654Z"
          fill="#2196F3"
        />
      </svg>

      {showText && (
        <div className={showDomain ? "flex flex-col ml-2" : "ml-2"}>
          <h2 className="text-xl font-bold text-gray-800">WingPro</h2>
          {showDomain && (
            <div className="text-xs text-blue-500">thewingpro.com</div>
          )}
        </div>
      )}
    </div>
  );
};

export default WingProLogo;
