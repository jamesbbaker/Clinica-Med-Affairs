import React, { useContext } from "react";
import { MultiSelect } from "react-multi-select-component";

import { selectLabels } from "../../constants/appConstants";
import { AuthContext } from "../../context/AuthContext";
import { CustomOptionRenderer } from "../Table";

const filterOptions = [...Object.keys(selectLabels)];

const Prioitize = () => {
  const {  selectedUnmet, setSelectedUnmet } =
    useContext(AuthContext);
  
  const handleSelectMultipleUnmet = (val) => {
    if (val.length > 5) {
      return;
    }
   

    setSelectedUnmet(val);
  };



  return (
    selectedUnmet && (
      <div className="flex border-b-2 pb-10 flex-col mb-6 items-start w-full">
        <div className="mb-6 w-full flex justify-between items-center font-[500]">
          <h2>Prioritize Unmet Needs</h2>
        
        </div>
        <div className="flex w-full justify-between items-center gap-6">
          <MultiSelect
            ItemRenderer={CustomOptionRenderer}
            labelledBy=""
            options={filterOptions.map((item) => ({
              label: selectLabels[item] ? selectLabels[item] : item,
              value: item,
            }))}
            className="w-[40rem] z-[5]"
            value={selectedUnmet}
            onChange={(val) => handleSelectMultipleUnmet(val)}
          />
          <div className="grid w-full grid-cols-5 gap-2">
            {selectedUnmet.map((item, index) => {
              return (
                <div
                  className=" px-2 rounded-md shadow-box-2 grid place-content-center py-2 font-[500] text-center"
                  key={index}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )
  );
};

export default Prioitize;
