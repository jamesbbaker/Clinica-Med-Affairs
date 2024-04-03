import React from "react";
import Map from "../../components/Map";
import BarChart from "../../components/BarChart";
import { RadarChart } from "../../components/RadarChart";
import Table from "../../components/Table";
import { APP_ROUTES } from "../../constants/appConstants";
import { useSelector } from "react-redux";
import { LineChart } from "../../components/LineChart";
import Sankey from "../../components/Sankey";
import ImpactTracking from "./ImpactTracking";
import InstitutionalVariation from "./InstituitonalVariation";

const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
  responsive: true,
  scales: {
    y: {
      display: false,
      ticks: {
        stepSize: 1,
        min: 0,
        autoSkip: false,
        font: {
          size: 10,
          weight: 700,
        },
      },
    },
    x: {
      title: {
        display: true,
        text: "Percent of eligible Patients",
      },
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value, index, ticks) {
          return `${value}%`;
        },
        font: {
          size: 10,
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const labels = [
  "Improper CV risk testing",
  "Incomplete comorbidity testing",
  "Continued AF without treatment escalation",
  "Repeated cardioversions without treatment escalation",
  "Improper calcium channel blocker",
  "Off-label treatment",
  "High AF stroke risk without anticoagulant",
  "Improper support of therapy",
  "Failure to manage AEs",
  "Lack of monitoring by CV specialist",
  "Non-adherence to anticoagulants",
  "Non-adherence to other AF drug treatments",
  "Failure to complete follow-up testing",
];

const data = {
  labels,
  datasets: [
    {
      data: [10, 12, 30, 42, 23, 34, 56, 21, 46, 69, 69, 39, 29],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

const Output = () => {
  const { currentMenu } = useSelector((state) => state.menu);

  return (
    <>
      {currentMenu === APP_ROUTES.patient_journey && <Sankey />}
      {currentMenu == APP_ROUTES.patient_opportunity_mapping_and_strategy && (
        <>
          <Map />
          <div className="text-md font-medium mt-4">
            Summary of nation suboptimal treatment and trends over time
          </div>
          <div className="grid pb-40 grid-cols-2 ">
            <BarChart />
            <BarChart data={data} options={options} />
          </div>
        </>
      )}
      {currentMenu === APP_ROUTES.hcp_segmentation && (
        <div className="flex flex-col items-center ">
          <RadarChart />
          <LineChart height={100} />
        </div>
      )}
      {currentMenu === APP_ROUTES.eligible_patient_locator && <Table />}
      {currentMenu === APP_ROUTES.insitutional_variation && (
        <InstitutionalVariation />
      )}
      {currentMenu === APP_ROUTES.impact_tracking && <ImpactTracking />}
    </>
  );
};

export default Output;
