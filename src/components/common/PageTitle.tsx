// src/components/common/PageTitle.tsx
import React, { useEffect } from "react";
import setDocumentTitle from "../../utils/documentTitle";

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
  useEffect(() => {
    setDocumentTitle(title);
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
