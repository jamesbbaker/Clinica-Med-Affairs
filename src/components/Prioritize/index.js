import React, { useContext, useState } from "react";
import { MultiSelect } from "react-multi-select-component";

import {
  labelsMatrix,
  patientTotals,
  selectLabels,
} from "../../constants/appConstants";
import { AuthContext } from "../../context/AuthContext";
import { CustomOptionRenderer } from "../Table";

const filterOptions = [...Object.keys(selectLabels)].filter(
  (item) =>
    !item.toLowerCase().includes("percent") && !patientTotals.includes(item)
);

const Prioitize = () => {
  const { selectedUnmet, setSelectedUnmet } = useContext(AuthContext);

  const handleSelectMultipleUnmet = (val) => {
    let _selectedUnmets = val
      .filter(
        (item) =>
          !patientTotals.includes(item.value) &&
          labelsMatrix[item.value] &&
          labelsMatrix[item.value].Percent
      )
      .map((item) => {
        return {
          label: selectLabels[labelsMatrix[item.value].Percent],
          value: labelsMatrix[item.value].Percent,
        };
      });

      if (_selectedUnmets.length > 5) {
        return
      }

    let value = [...val, ..._selectedUnmets];
    const uniqueArray = Array.from(new Set(value.map((obj) => obj.value))).map(
      (id) => value.find((obj) => obj.value === id)
    );
    let valuesArr = uniqueArray.map((item) => item.value);
    let finalArr = uniqueArray.filter((item) =>
      valuesArr.includes(item.value.replace("Percent", "Number"))
    );
    setSelectedUnmet(finalArr);
  };

  return (
    selectedUnmet && (
      <div className="flex border-b-2 pb-10 flex-col mb-6 items-start w-full">
        <div className="mb-6 w-full flex justify-between items-center font-[500]">
          <h2>Prioritize Unmet Needs</h2>
        </div>
        <div className="flex w-full flex-col custom:flex-row justify-between custom:items-center items-start gap-6">
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
            {selectedUnmet
              .filter((item) => !item.value.toLowerCase().includes("percent"))
              .map((item, index) => {
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
