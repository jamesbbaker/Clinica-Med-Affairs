import React, { useContext, useEffect, useRef, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { customOptionRenderer } from "../Table";
import { selectLabels } from "../../constants/appConstants";
import { AuthContext } from "../../context/AuthContext";
import { getDataStats } from "../../API/Outputs";

const filterOptions = [...Object.keys(selectLabels)];

const Prioitize = () => {
  const [selectedUnmet, setSelectedUnmet] = useState([]);
  const { accessToken, refreshToken } = useContext(AuthContext);
  const timerRef = useRef(null);

  useEffect(() => {
    getDataStats("get_priorities", accessToken, refreshToken)
      .then((res) => {
        let prioritiesList = res.priorities.split(",").filter(item => item.length)
        setSelectedUnmet(
          prioritiesList.map((item) => ({
            label: selectLabels[item] ? selectLabels[item] : item,
            value: item,
          }))
        );
      })
      .catch((Err) => {
        console.log(Err);
      });
  }, []);

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
          {selectedUnmet.map((item, index) => {
            return (
              <div
                className="border rounded-lg grid place-content-center py-2 font-[500] text-center"
                key={index}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Prioitize;
