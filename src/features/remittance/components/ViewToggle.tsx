// src/features/remittance/components/ViewToggle.tsx
import React from "react";
import { LayoutGrid, Table } from "lucide-react";

interface ViewToggleProps {
  viewMode: "card" | "table";
  onViewModeChange: (mode: "card" | "table") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange("card")}
        className={`p-2 rounded-lg transition-all ${
          viewMode === "card"
            ? "bg-yellow-500 text-black"
            : "text-gray-400 hover:text-white"
        }`}
        title="Card View"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
      <button
        onClick={() => onViewModeChange("table")}
        className={`p-2 rounded-lg transition-all ${
          viewMode === "table"
            ? "bg-yellow-500 text-black"
            : "text-gray-400 hover:text-white"
        }`}
        title="Table View"
      >
        <Table className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ViewToggle;
