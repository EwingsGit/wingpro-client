// src/components/common/WingProLogo.tsx
import React from "react";

interface WingProLogoProps {
  className?: string;
  showText?: boolean;
  showDomain?: boolean;
}

const WingProLogo: React.FC<WingProLogoProps> = ({
  className = "",
  showText = true,
  showDomain = true,
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center">
        {/* Blue wing logo */}
        <svg
          width="50"
          height="32"
          viewBox="0 0 184 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2"
        >
          <path
            d="M183.751 0L69.096 85.461L0 76.673L183.751 0Z"
            fill="#2174EA"
          />
          <path
            d="M252.698 36.217L103.927 144L41.995 114.808L252.698 36.217Z"
            fill="#2174EA"
          />
        </svg>

        {showText && (
          <span className="text-2xl font-bold text-gray-800">WingPro</span>
        )}
      </div>

      {showDomain && (
        <span className="text-sm text-blue-400">thewingpro.com</span>
      )}
    </div>
  );
};

export default WingProLogo;
