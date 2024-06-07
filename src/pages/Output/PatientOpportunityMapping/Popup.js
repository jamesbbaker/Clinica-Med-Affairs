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
  return (
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
  );
};

export default BarChartPopup;
