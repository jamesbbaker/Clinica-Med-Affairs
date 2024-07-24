import React from "react";
import RadarChart from "../../components/RadarChart";
import RealTimeBox from "../../components/RealTimeBox";
import HCPTable from "../../components/HCPTable";

const Testing = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <RadarChart />
      <RealTimeBox />
      <HCPTable />
    </div>
  );
};

export default Testing;
