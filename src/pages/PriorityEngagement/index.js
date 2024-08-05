import React, { useContext, useEffect, useRef, useState } from "react";
import CustomDropdown from "../../components/CustomDropdown";
import { filterOutLabels } from "../../utils/MapUtils";
import { patientTotals, selectLabels } from "../../constants/appConstants";
import { AuthContext } from "../../context/AuthContext";
import { getDataStats } from "../../API/Outputs";
import { LineChart } from "../../components/LineChart";
import HcpInsight from "../Output/HcpInsights";
import MedicalAffairToolbox from "../Output/MedicalAffairsToolbox";
import InstitutionalVariationBubbleChart from "../Output/InstituitonalVariation/InstitutionalVariationBubbleChart";
import PayerVariationBubbleChart from "../Output/PayerVariation/PayerVariationBubbleChart";
import { Bounce, toast, ToastContainer } from "react-toastify";
import PrimaryBtn from "../../components/PrimaryBtn";

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

const charts = [
  {
    name: "HCP",
    id: "hcp",
  },
  {
    name: "Hospital / Clinic / System",
    id: "hospital_clinic_system",
  },
  {
    name: "Payer / Plan",
    id: "payer_plan",
  },
];

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

const PriorityEngagement = () => {
  const [crfLineData, setCrfLineData] = useState({});
  const [primarySpecialtyData, setPrimarySpecialtyData] = useState(null);
  const [crfUnmetNeed, setCrfUnmetNeed] = useState(null);
  const [crfData, setCrfData] = useState(null);
  const [currentChart, setCurrentChart] = useState(charts[0].id);
  const [isScatterMapOpen, setIsScatterMapOpen] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [lineChartData, setLineChartData] = useState({});
  const [dataLoad, setDataLoad] = useState(false);
  const [barchartData, setBarChartData] = useState(null);

  const [allScatterData, setAllScatterData] = useState({
    hcp: {},
    hospital: {},
    payer: {},
  });
  const updateRef = useRef(false);

  const handleChange = (val) => {
    setDataLoad(true);
    getDataStats(
      `hcp_crf?category=${
        val ? val : "Number of ICS-LABA Exacerbation Failed Escalation"
      }`,
      accessToken,
      refreshToken
    )
      .then((res) => {
        setDataLoad(false);
        setBarChartData(null);
        updateRef.current = true;
        setCrfData(res.crf_data);
        handleSelectFilter(val, res.crf_data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSelectFilter = (val, _crfData) => {
    let __crfData = _crfData ? _crfData : crfData;
    setCrfUnmetNeed(val);

    setPrimarySpecialtyData(__crfData["Primary Specialty"]);

    let _data = {
      labels: __crfData["HCP Index"],
      datasets: [
        {
          label: "Dataset 1",
          data: __crfData["Cumulative Unmet Need"],
          borderColor: __crfData["Primary Specialty"].map((item) =>
            generateColor(item)
          ),
          pointRadius: 10,
          backgroundColor: __crfData["Primary Specialty"].map((item) =>
            generateColor(item)
          ),
        },
      ],
    };
    setCrfLineData(_data);
    setPageData((prev) => ({
      ...prev,
      unmet_need: val,
    }));
  };

  useEffect(() => {
    getDataStats(
      `hcp_crf?category=${
        crfUnmetNeed
          ? crfUnmetNeed
          : "Number of ICS-LABA Exacerbation Failed Escalation"
      }`,
      accessToken,
      refreshToken
    )
      .then((res) => {
        setCrfData(res.crf_data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getDataStats("get_hcp_concentration_curve", accessToken, refreshToken)
      .then((res) => {
        setLineChartData(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setLineChartData(null);
        }
      });
    getDataStats("get_hcp_scatter", accessToken, refreshToken)
      .then((res) => {
        setAllScatterData((prev) => ({
          ...prev,
          hcp: { ...res.data },
        }));
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setAllScatterData((prev) => ({
            ...prev,
            hcp: null,
          }));
        }
      });
    getDataStats("get_hospital_scatter", accessToken, refreshToken)
      .then((res) => {
        setAllScatterData((prev) => ({
          ...prev,
          hospital: { ...res.data },
        }));
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setAllScatterData((prev) => ({
            ...prev,
            hospital: null,
          }));
        }
      });
    getDataStats("get_payer_scatter", accessToken, refreshToken)
      .then((res) => {
        setAllScatterData((prev) => ({
          ...prev,
          payer: { ...res.data },
        }));
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setAllScatterData((prev) => ({
            ...prev,
            payer: null,
          }));
        }
      });
  }, []);

  const { accessToken, refreshToken, selectedUnmet } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const saveScatterData = async (url, data) => {
    let scatter_data = {
      unmet_need_1: data.unmet_need_1,
      value_1: data.value_1,
      unmet_need_2: data.unmet_need_2,
      value_2: data.value_2,
    };
    try {
      const response = await fetch(`https://clinica-server.replit.app/${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(scatter_data),
      });
      const res = await response.json();
      return res;
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  };

  const handleSave = async () => {
    // if (!PriorityselectedValue) {
    //   return;
    // }
    setLoading(true);

    if (currentChart === charts[0].id) {
      let hcp_concentration_data = {
        unmet_need: pageData.unmet_need,
        value: pageData.value,
      };

      try {
        const response = await fetch(
          "https://clinica-server.replit.app/set_hcp_concentration_curve",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(hcp_concentration_data),
          }
        );
        await response.json();
        let _response = await saveScatterData("set_hcp_scatter", pageData);
        if (_response) {
          setLoading(false);
          toast.success("Saved successfully!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      } catch (err) {
        console.log(err);
        throw new Error();
      }
    } else if (currentChart === charts[1].id) {
      try {
        let _response = await saveScatterData("set_hospital_scatter", pageData);
        if (_response) {
          setLoading(false);
          toast.success("Saved successfully!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      } catch (err) {
        console.log(err);
        throw new Error();
      }
    } else if (currentChart === charts[2].id) {
      try {
        let _response = await saveScatterData("set_payer_scatter", pageData);
        if (_response) {
          setLoading(false);
          toast.success("Saved successfully!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      } catch (err) {
        console.log(err);
        throw new Error();
      }
    }
  };

  const updateRef_chart = useRef(false);

  useEffect(() => {
    if (updateRef.current) {
      return;
    }
    if (crfData && selectedUnmet.length > 0 && lineChartData === null) {
      let filterLabels = filterOutLabels(
        Object.keys(selectLabels),
        selectedUnmet
      );
      handleChange(filterLabels[0]);
    } else if (crfData && lineChartData === null) {
      handleChange("Number of ICS-LABA Exacerbation Failed Escalation");
    } else if (
      crfData &&
      lineChartData &&
      Object.values(lineChartData).length > 0
    ) {
      handleChange(lineChartData.unmet_need);
    }
  }, [crfData, lineChartData, selectedUnmet]);

  const handleSelectChart = (val) => {
    setCurrentChart(val);
    setPageData(null);
  };

  return (
    <div className="flex flex-col items-start ">
      {!isScatterMapOpen && (
        <>
          <ToastContainer />
          <div className="w-full sticky top-14 z-50 bg-[#d4d4d4] mb-8 grid grid-cols-3">
            {charts.map((item, index) => (
              <div key={index} className="text-[#000]">
                <button
                  className={`text-[#000] hover:shadow-xl transition-all ease-in-out duration-300 shadow-md md:text-lg text-sm px-4 w-full text-center py-4 font-[500] ${
                    currentChart === item.id
                      ? "bg-blue-500 text-white"
                      : "text-gray-700"
                  } ${index === 1 && " border-r-2 border-l-2"}`}
                  onClick={() => handleSelectChart(item.id)}
                >
                  {item.name}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      <div
        style={{
          display:
            currentChart !== "hcp" || isScatterMapOpen ? "none" : "block",
        }}
        className="w-full flex flex-col items-start"
      >
        <div className="mb-4">
          <HcpInsight />
        </div>
        {crfData && crfLineData && crfUnmetNeed && !dataLoad ? (
          <>
            <div className="text-left w-full py-4 font-[500]">
              Patient Unmet Need Concentration by HCPs
            </div>
            <div className=" self-start">
              <CustomDropdown
                buttonWidth="40rem"
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
                    .filter(
                      (item) =>
                        !patientTotals.includes(item) &&
                        !item.toLowerCase().includes("percent")
                    )
                    .map((item) => ({
                      name: selectLabels[item] ? selectLabels[item] : item,
                      value: item,
                    })),
                  id: "yLabel",
                }}
                value={crfUnmetNeed}
                handleSelect={(val) => handleChange(val)}
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
              updateRef={updateRef_chart}
              barchartData={barchartData}
              setBarChartData={setBarChartData}
              arb_value={lineChartData && lineChartData.value}
              setPageData={setPageData}
              primarySpecialtyData={primarySpecialtyData}
              options={defaultOptions}
              data={crfLineData}
              height={60}
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
      <div className="flex flex-col items-start gap-2 w-full">
        <div
          style={{
            display: currentChart === "hcp" ? "block" : "none",
          }}
          className="w-full"
        >
          <MedicalAffairToolbox
            ScatterData={allScatterData.hcp}
            setPageData={setPageData}
            isPageUpdatable={currentChart === "hcp"}
            scatterValue="hcp"
            isScatterMapOpen={isScatterMapOpen}
            setIsScatterMapOpen={setIsScatterMapOpen}
          />
        </div>
        <div
          style={{
            display:
              currentChart === "hospital_clinic_system" ? "block" : "none",
          }}
          className="w-full"
        >
          <InstitutionalVariationBubbleChart
            ScatterData={allScatterData.hospital}
            isPageUpdatable={currentChart === "hospital_clinic_system"}
            setPageData={setPageData}
            isScatterMapOpen={isScatterMapOpen}
            scatterValue="hospital_clinic_system"
            setIsScatterMapOpen={setIsScatterMapOpen}
          />
        </div>
        <div
          style={{
            display: currentChart === "payer_plan" ? "block" : "none",
          }}
          className="w-full"
        >
          <PayerVariationBubbleChart
            ScatterData={allScatterData.payer}
            isScatterMapOpen={isScatterMapOpen}
            isPageUpdatable={currentChart === "payer_plan"}
            setPageData={setPageData}
            scatterValue={"payer_plan"}
            setIsScatterMapOpen={setIsScatterMapOpen}
          />
        </div>
      </div>
      {!isScatterMapOpen && (
        <div className="w-full flex mt-8 items-center justify-center">
          <PrimaryBtn
            disabled={loading}
            text={"Save"}
            className={"w-[10rem] text-[#fff]"}
            onClick={handleSave}
          />
        </div>
      )}
    </div>
  );
};

export default PriorityEngagement;
