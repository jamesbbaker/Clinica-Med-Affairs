import React, { useContext, useRef } from "react";
import { MultiSelect } from "react-multi-select-component";

import { selectLabels } from "../../constants/appConstants";
import { AuthContext } from "../../context/AuthContext";
import { CustomOptionRenderer } from "../Table";

const filterOptions = [...Object.keys(selectLabels)];

const Prioitize = () => {
  const { accessToken, selectedUnmet, setSelectedUnmet } =
    useContext(AuthContext);
  const timerRef = useRef(null);

  const handlePrioritize = async (val) => {
    let prioritiesList = "";
    val.forEach((element) => {
      prioritiesList += `${element.value},`;
    });

    let data = {
      priorities: prioritiesList,
    };
    try {
      const response = await fetch(
        "https://clinica-server.replit.app/set_priorities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );
      const res = await response.json();

      return res;
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  };

  const handleSelectMultipleUnmet = (val) => {
    if (val.length > 5) {
      return;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = setTimeout(() => {
      handlePrioritize(val);
    }, 500);

    setSelectedUnmet(val);
  };

  return (
    selectedUnmet && (
      <div className="flex border-b-2 pb-10 flex-col mb-6 items-start w-full">
        <h4 className="mb-6 font-[500]">Prioritize Unmet Needs</h4>
        <div className="flex w-full justify-between items-center gap-6">
          <MultiSelect
            ItemRenderer={CustomOptionRenderer}
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
