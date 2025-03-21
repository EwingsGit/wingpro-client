// src/components/common/PageTitle.tsx
import React from "react";

interface PageTitleProps {
  title: string;
  className?: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  className = "text-2xl font-bold",
  showAddButton = false,
  onAddClick,
}) => {
  // Set document title when component mounts
  React.useEffect(() => {
    document.title = `${title} | WingPro`;
  }, [title]);

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className={className}>{title}</h1>
      {showAddButton && (
        <button
          onClick={onAddClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New Task
        </button>
      )}
    </div>
  );
};

export default PageTitle;
