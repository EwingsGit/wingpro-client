// src/components/common/WingProLogo.tsx
import React from "react";

const WingProLogo: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <svg
          width="40"
          height="24"
          viewBox="0 0 253 144"
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
        <span className="text-2xl font-bold text-gray-800">WingPro</span>
      </div>
      <span className="text-sm text-blue-400">thewingpro.com</span>
    </div>
  );
};

export default WingProLogo;
