import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { customOptionRenderer } from "../Table";
import { selectLabels } from "../../constants/appConstants";

const filterOptions = [...Object.keys(selectLabels)];

const Prioitize = () => {
  const [selectedUnmet, setSelectedUnmet] = useState([]);

  const handleSelectMultipleUnmet = (val) => {
    if (val.length > 5) {
        return
    }
    setSelectedUnmet(val);
  };


  return (
    <div className="flex border-b-2 pb-10 flex-col items-start w-full">
      <h4 className="mb-6 font-[500]">Prioritize Unmet Needs</h4>
      <div className="flex w-full justify-between items-center gap-6">
      <MultiSelect
        ItemRenderer={customOptionRenderer}
        labelledBy=""
        options={filterOptions.map((item) => ({
          label: selectLabels[item] ? selectLabels[item] : item,
          value: item,
        }))}
        className="w-[30%] z-[5]"
        value={selectedUnmet}
        onChange={(val) => handleSelectMultipleUnmet(val)}
      />
      <div className="grid w-[70%] grid-cols-5 gap-2">
      {selectedUnmet.map(item => {
        return <div className="border rounded-lg grid place-content-center py-2 font-[500] text-center" key={item}>{item.label}</div>;
      })}
      </div>
      </div>
    </div>
  );
};

export default Prioitize;
