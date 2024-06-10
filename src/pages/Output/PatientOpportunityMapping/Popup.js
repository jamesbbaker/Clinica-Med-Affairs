import React from "react";
import BarChart from "../../../components/BarChart";

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "m";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + "k";
  }
  return num.toLocaleString();
};

const BarChartPopup = ({ data1 }) => {
  console.log(data1)

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex mt-4 items-center gap-4">
      <div className="flex items-center">Name: <strong className="ml-2">{data1["0"]["Assigned Physician Name"]}</strong></div>
      <div className="flex items-center">Primary Specialty Description: <strong className="ml-2">{data1["0"]["Primary Specialty Description"]}</strong></div>
      <div className="flex items-center">Region: <strong className="ml-2">{data1["0"]["Region"]}</strong></div>
      </div>
      <div className="w-[80vw] gap-5 grid grid-cols-2">
        <div>
          <BarChart
            label={`Diagnosis and Investigation`}
            height={80}
            data={data1.mapValue1}
          />
        </div>
        <div>
          <BarChart
            label={`Treatment (ICS or beta-agonist)`}
            height={80}
            data={data1.mapValue3}
          />
        </div>
        <div>
          <BarChart
            label={`Treatment (ICS-LABA)`}
            height={80}
            data={data1.mapValue4}
          />
        </div>
        <div>
          <BarChart
            label={`Treatment (ICS-LABA-LAMA)`}
            height={80}
            data={data1.mapValue5}
          />
        </div>
      </div>
    </div>
  );
};

export default BarChartPopup;
