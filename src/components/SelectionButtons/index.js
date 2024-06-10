import React from "react";

const SelectionButtons = ({ selectedValues, data, onClick, visibleKey }) => {
 
  return (
    <div className="flex flex-wrap items-center gap-2">
      {data.map((column) => {
  
        return (
          <div
          key={column.accessor}
            onClick={() => onClick(column)}
            className={`px-2 text-xs cursor-pointer  ${
              column[visibleKey] ||
              (selectedValues && selectedValues.includes(column.accessor))
                ? "bg-orange-300"
                : "hover:bg-orange-200"
            }  py-1 border border-gray-700 rounded-sm`}
          >
            {column.Header}
          </div>
        );
      })}
    </div>
  );
};

export default SelectionButtons;
