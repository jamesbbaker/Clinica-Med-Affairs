import React, { useState } from "react";
import { HCP_DATA } from "../../pages/Home/data";

const HCPTable = () => {
  const [selectedTable, setSelectedTable] = useState(0);

  const handleSelect = (index) => {
    setSelectedTable(index);
  };

  return (
    <div className="flex shadow-box-2 mt-4 rounded-md  px-2 py-4">
      <div className="w-1/3 flex flex-col gap-2">
        {HCP_DATA.map((item, index) => {
          return (
            <div
              onClick={() => handleSelect(index)}
              className={`${
                index == selectedTable && "bg-violet-300"
              } rounded-sm p-2 cursor-pointer`}
            >
              {item.heading}
            </div>
          );
        })}
      </div>
      <div className="w-2/3 ml-4 border-2 border-primary p-2 rounded-lg">
        {HCP_DATA[selectedTable].table.map((item) => {
          return (
            <div className="w-full grid text-sm grid-cols-2 py-1">
              <div>{item.text}</div>
              <div>{item.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HCPTable;
