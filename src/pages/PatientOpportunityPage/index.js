import React, { useContext, useEffect, useState } from "react";
import UnmetNeedDefinition from "../Output/UnmetNeedDefinition";
import PatientOpportunityMapping from "../Output/PatientOpportunityMapping";
import ImpactTracking from "../Output/ImpactTracking";
import { selectLabels } from "../../constants/appConstants";
import { AuthContext } from "../../context/AuthContext";
import { getDataStats } from "../../API/Outputs";
import { LineChart } from "../../components/LineChart";
import CustomDropdown from "../../components/CustomDropdown";
import Prioitize from "../../components/Prioritize";
import { filterOutLabels } from "../../utils/MapUtils";

const defaultOptions = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: "HCPs ranked by patients with suboptimal care",
      },

      grid: {
        display: false,
      },
      // grid: {
      //   drawOnChartArea: false,
      //   drawOnAxisArea: false,
      // },
      ticks: {
        stepSize: 1000,
      },
    },
    y: {
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value, index, ticks) {
          return (value / 10) % 2 !== 0 ? "" : `${value}%`;
        },
        font: {
          size: 10,
        },
      },
    },
  },
  plugins: {
    datalabels: {
      display: false,
    },
    legend: {
      display: false, // Hide the legend
    },
  },
};

const colors = [
  { name: "Pulmonary Specialist", rgba: "rgba(135, 206, 235, 1)" },
  { name: "Allergy Specialist", rgba: "rgba(34, 139, 34, 1)" },
  { name: "Primary Care Provider", rgba: "rgba(220, 20, 60, 1)" },
  { name: "Others", rgba: "rgba(255, 215, 0, 1)" },
];

const PatientOpportunityPage = () => {
  const [crfData, setCrfData] = useState(null);
  const [crfLineData, setCrfLineData] = useState({});
  const [crfUnmetNeed, setCrfUnmetNeed] = useState(null);
  const { accessToken, refreshToken, selectedUnmet } = useContext(AuthContext);

  const handleSelectFilter = (val) => {
    setCrfUnmetNeed(val);
    let _data = {
      labels: crfData[val]["HCP Index"],
      datasets: [
        {
          label: "Dataset 1",
          data: crfData[val]["Cumulative Unmet Need"],
          // borderColor: "rgb(0, 0, 139)",
          backgroundColor: crfData[val]["Primary Specialty"].map(item => generateColor(item)),
        },
      ],
    };

    setCrfLineData(_data);
  };

  useEffect(() => {
    if (crfData && selectedUnmet.length > 0) {
    
      let filterLabels = filterOutLabels(
        Object.keys(selectLabels),
        selectedUnmet
      ).filter((item) => crfData.hasOwnProperty(item));
   

      handleSelectFilter(filterLabels[0]);
    } else if (crfData) {
      handleSelectFilter("Number of No Spirometry");
    }
  }, [crfData, selectedUnmet]);
  const generateColorBorder = (val) => {
    let shape1 = [
      "PULMONARY DISEASE",
      "PEDIATRIC PULMONOLOGY",
      "PULMONARY CRITICAL CARE MEDICINE",
    ];
    if (shape1.includes(val)) {
      return "rgba(135, 206, 235, 0.3)";
    }
    let shape2 = ["ALLERGY & IMMUNOLOGY"];
    if (shape2.includes(val)) {
      return "rgba(34, 139, 34, 0.3)";
    }
    let shape3 = [
      "FAMILY MEDICINE",
      "PEDIATRICS",
      "INTERNAL MEDICINE",
      "GENERAL PRACTICE",
      "INTERNAL MEDICINE/PEDIATRICS",
      "GERIATRIC MEDICINE (INTERNAL MEDICINE)",
      "GERIATRIC MEDICINE (FAMILY MEDICINE)",
    ];
    if (shape3.includes(val)) {
      return "rgba(220, 20, 60, 0.4)";
    }

    return "rgba(255, 215, 0, 0.4)";
  };

  const generateColor = (val) => {
 
    let shape1 = [
      "PULMONARY DISEASE",
      "PEDIATRIC PULMONOLOGY",
      "PULMONARY CRITICAL CARE MEDICINE",
    ];
    if (shape1.includes(val)) {
      return "rgba(135, 206, 235, 1)";
    }
    let shape2 = ["ALLERGY & IMMUNOLOGY"];
    if (shape2.includes(val)) {
      return "rgba(34, 139, 34, 1)";
    }
    let shape3 = [
      "FAMILY MEDICINE",
      "PEDIATRICS",
      "INTERNAL MEDICINE",
      "GENERAL PRACTICE",
      "INTERNAL MEDICINE/PEDIATRICS",
      "GERIATRIC MEDICINE (INTERNAL MEDICINE)",
      "GERIATRIC MEDICINE (FAMILY MEDICINE)",
    ];
    if (shape3.includes(val)) {
      return "rgba(220, 20, 60, 1)";
    }

    return "rgba(255, 215, 0, 1)";
  };

  useEffect(() => {
    getDataStats("hcp_crf", accessToken, refreshToken)
      .then((res) => {
        setCrfData(res.crf_data);

        // setCrfUnmetNeed("Number of No Spirometry");
        // let _data = {
        //   labels: res.crf_data["Number of No Spirometry"]["HCP Index"],
        //   datasets: [
        //     {
        //       label: "Dataset 1",
        //       data: res.crf_data["Number of No Spirometry"][
        //         "Cumulative Unmet Need"
        //       ],
        //       // borderColor: generateColorBorder(res.crf_data["Number of No Spirometry"]["Primary Specialty"]),
        //       backgroundColor: generateColor(res.crf_data["Number of No Spirometry"]["Primary Specialty"]),
        //     },
        //   ],
        // };
        // setCrfLineData(_data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="flex flex-col gap-8 items-start w-full">
      <UnmetNeedDefinition />
      <PatientOpportunityMapping patientPage />
      <ImpactTracking patientPage />

      <div className="w-full mt-4">
        <Prioitize />

        <div className="flex flex-col items-center ">
          {crfData && crfLineData && crfUnmetNeed ? (
            <>
              <div className="text-left w-full py-4 font-[500]">
                Patient Unmet Need Concentration by HCPs
              </div>
              <div className=" self-start">
                <CustomDropdown
                  showColors
                  labelClassName="mb-0"
                  className={"flex items-center gap-2"}
                  input={{
                    label: "Unmet Need select",
                    name: "Unmet Need select",
                    type: "select",
                    options: filterOutLabels(
                      Object.keys(selectLabels),
                      selectedUnmet
                    )
                      .filter((item) => crfData.hasOwnProperty(item))
                      .map((item) => ({
                        name: selectLabels[item] ? selectLabels[item] : item,
                        value: item,
                      })),
                    id: "yLabel",
                  }}
                  value={crfUnmetNeed}
                  handleSelect={(val) => handleSelectFilter(val)}
                />
              </div>
              <div className="w-full flex mt-4 justify-center gap-10 items-center">
                {colors.map((item) => (
                  <div key={item.name} className="flex gap-1 items-center">
                    <div
                      style={{ background: item.rgba }}
                      className={`flex w-4 h-4`}
                    ></div>
                    <div className="flex text-xs">{item.name}</div>
                  </div>
                ))}
              </div>
              <LineChart
                options={defaultOptions}
                data={crfLineData}
                height={100}
              />
            </>
          ) : (
            <>
              <div className="w-full h-[400px] grid place-content-center">
                <div className="text-center">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientOpportunityPage;
