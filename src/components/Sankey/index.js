import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["From", "To", "Percentage"],
  ["A", "X", 5],
  ["A", "Y", 7],
  ["A", "Z", 6],
  ["B", "X", 2],
  ["B", "Y", 9],
  ["B", "Z", 4],
  ["X", "S", 2],
  ["X", "T", 4],
  ["X", "V", 2],
  ["Y", "V", 4],
  ["Y", "T", 2],
  ["Z", "V", 1],
  ["Z", "T", 3],
];

export const options = {};

const Sankey = () => {
  return (
    <div className="px-2 py-4">
      <Chart
        chartType="Sankey"
        width="100%"
        height="200px"
        data={data}
        options={options}
      />
    </div>
  );
};

export default Sankey;
