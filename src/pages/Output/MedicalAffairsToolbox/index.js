import React, { useContext, useEffect, useReducer, useState } from "react";
import ScatterChart from "../../../components/ScatterChart";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import { highestValue } from "../../../utils/MathUtils";
import { MultiSelect } from "react-multi-select-component";
import CustomDropdown from "../../../components/CustomDropdown";
import { selectLabels } from "../../../constants/appConstants";
import { filterOutLabels } from "../../../utils/MapUtils";

const filterOptions = [...Object.keys(selectLabels)];

const initialState = {
  data: null,
  xLabel: filterOptions[0],
  yLabel: filterOptions[filterOptions.length - 1],
};

const actions = {
  handleUpdateData: "handleUpdateData",
  handleUpdate: "handleUpdate",
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case actions.handleUpdate:
      return {
        ...state,
        ...payload,
      };
    case actions.handleUpdateData:
      return {
        ...state,
        data: payload,
      };
    default:
      return state;
  }
};

const MedicalAffairToolbox = ({
  ScatterData,
  isPageUpdatable,
  setPageData,
  scatterValue,
  isScatterMapOpen,
  setIsScatterMapOpen,
  setHcpProfilePage = () => {},
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { accessToken, selectedUnmet, refreshToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState(null);

  const [lineX, setLineX] = useState(10);
  const [lineY, setLineY] = useState(10);

  const [quadrantValues, setQuadrantValues] = useState({
    topLeft: 0,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: 0,
  });

  useEffect(() => {
    if (state.data) {
      let topLeft = 0;
      let topRight = 0;
      let bottomLeft = 0;
      let bottomRight = 0;
      state.data.datasets[0].data.forEach((item) => {
        if (item.x < lineX && item.y < lineY) {
          bottomLeft += 1;
        } else if (item.x >= lineX && item.y < lineY) {
          bottomRight += 1;
        } else if (item.x < lineX && item.y >= lineY) {
          topLeft += 1;
        } else {
          topRight += 1;
        }
      });
      if (isPageUpdatable) {
        setPageData((prev) => ({
          ...prev,
          value_1: lineX,
          value_2: lineY,
        }));
      }
      setQuadrantValues({
        topLeft,
        topRight,
        bottomLeft,
        bottomRight,
      });
    }
  }, [lineX, lineY, state.data]);

  const fetchData = (
    filters = {
      specialties: state.primary,
      region: state.region,
    }
  ) => {
    const specialties = filters.specialties;
    const region = filters.region;
    let queryString = `hcp_variation_data?&`; // Start with 'hcp_data?&'

    if (specialties && specialties.length > 0) {
      queryString += specialties
        .map((specialty) => `Primary Specialty Description=${specialty.value}`)
        .join("&");
    }
    if (region && region.length > 0) {
      queryString += `&${region
        .map((region) => `Region=${region.value}`)
        .join("&")}`;
    }
    // Combine the base URL, dynamic specialties, and additional parameters
    const finalUrl = `${queryString}`;

    getDataStats(finalUrl, accessToken, refreshToken)
      .then((res) => {
        let _data = JSON.parse(res.replaceAll("NaN", 0));

        setRawData(_data.data);
        if (_data) {
          dispatch({
            type: actions.handleUpdate,
            payload: {
              regionList: _data.region_list,
              primaryList: _data.specialty_list,
            },
          });
          let data = handleChartData(_data.data);

          dispatch({
            type: actions.handleUpdateData,
            payload: data,
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  const generateShape = (val) => {
    let shape1 = [
      "PULMONARY DISEASE",
      "PEDIATRIC PULMONOLOGY",
      "PULMONARY CRITICAL CARE MEDICINE",
    ];
    if (shape1.includes(val)) {
      return "triangle";
    }
    let shape2 = ["ALLERGY & IMMUNOLOGY"];
    if (shape2.includes(val)) {
      return "circle";
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
      return "rect";
    }

    return "star";
  };

  const calculateRadius = (value, maxValue) => {
    const maxRadius = 30;
    const minRadius = 0;
    // Scale the value between 0 and 1 based on maxValue
    const normalizedValue = value / maxValue;
    // Calculate the radius within the specified range
    return minRadius + normalizedValue * (maxRadius - minRadius);
  };
  const handleChartData = (
    data,
    vabelValues = {
      xLabel: state.xLabel,
      yLabel: state.yLabel,
    }
  ) => {
    let radius = "Number of ICS-LABA Patients";
    const maxValue = highestValue(data, radius);

    let _data = data.map((item) => ({
      name: item["Assigned Physician Name"],
      x: item[vabelValues.xLabel],
      y: item[vabelValues.yLabel],
      r: calculateRadius(item[radius], maxValue),
      ...item,
      value: item[radius],
    }));

    let _scatterData = {
      datasets: [
        {
          label: "HCP Profiles",
          data: _data,
          backgroundColor: _data.map((item) => {
            if (item.x < lineX && item.y < lineY) {
              return "#d4d4d4";
            } else if (item.x >= lineX && item.y < lineY) {
              return "#E0B0FF";
            } else if (item.x < lineX && item.y >= lineY) {
              return "#4B0082";
            } else {
              return "#FF0000";
            }
          }),
          pointStyle: _data.map((item) =>
            generateShape(item["Primary Specialty Description"])
          ),
          // borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    return _scatterData;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUnmet.length > 0 && rawData && ScatterData === null) {
      handleSelect("xLabel", selectedUnmet[0].value);
    }
    if (selectedUnmet.length > 1 && rawData && ScatterData === null) {
      handleSelect("yLabel", selectedUnmet[1].value);
    }
    if (ScatterData && rawData && Object.values(ScatterData).length > 0) {
      handleSelect("xLabel", ScatterData.unmet_need_1, false);
      handleSelect("yLabel", ScatterData.unmet_need_2, false);
      setLineX(ScatterData.value_1);
      setLineY(ScatterData.value_2);
      setPageData((prev) => ({
        ...prev,
        ...ScatterData,
      }));
    }
  }, [selectedUnmet, isPageUpdatable, rawData, ScatterData]);

  const handleDispatchData = (labelValue, chartData) => {
    let data = handleChartData(rawData, labelValue);
    dispatch({
      type: actions.handleUpdateData,
      payload: data,
    });
  };

  const handleSelect = (id, val, firstUpdate = true) => {
    dispatch({
      type: actions.handleUpdate,
      payload: {
        [id]: val,
      },
    });

    let labelValue = {
      xLabel: id === "xLabel" ? val : state.xLabel,
      yLabel: id === "yLabel" ? val : state.yLabel,
    };
    let pageDataValue = {
      unmet_need_1: id === "xLabel" ? val : state.xLabel,
      unmet_need_2: id === "yLabel" ? val : state.yLabel,
    };
    if (isPageUpdatable && firstUpdate) {
      setPageData((prev) => ({
        ...prev,
        ...pageDataValue,
      }));
    }
    handleDispatchData(labelValue);
  };

  const handleToggleSelect = (val, id) => {
    dispatch({
      type: actions.handleUpdate,
      payload: {
        [id]: val,
      },
    });
  };

  const handleApplyFilter = () => {
    setLoading(true);
    fetchData({
      specialties: state.primary,
      region: state.region,
    });
  };

  return (
    <div className="flex flex-col mt-6 w-full gap-2 items-start">
      {/* {!isScatterMapOpen && <div className="text-[1.25rem] font-[600]">HCP Prioritization</div>} */}
      {state.data ? (
        <>
          {!isScatterMapOpen && (
            <>
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center gap-8">
                  <div className="font-[600] text-[18px]">Filters:</div>
                  {state.regionList && (
                    <div className="flex items-center gap-4">
                      <label className="block text-sm font-medium text-gray-900 ">
                        Region Select
                      </label>
                      <MultiSelect
                        labelledBy=""
                        options={state.regionList.map((item) => ({
                          label: item,
                          value: item,
                        }))}
                        className="w-[10rem] z-[5]"
                        value={state.region || []}
                        onChange={(val) => handleToggleSelect(val, "region")}
                      />
                    </div>
                  )}
                  {state.primaryList && (
                    <div className="flex items-center gap-4">
                      <label className="block text-sm font-medium text-gray-900 ">
                        Specialty
                      </label>
                      <MultiSelect
                        labelledBy=""
                        options={state.primaryList.map((item) => ({
                          label: item,
                          value: item,
                        }))}
                        className="w-[20rem] z-[5]"
                        value={state.primary || []}
                        onChange={(val) => handleToggleSelect(val, "primary")}
                      />
                    </div>
                  )}
                </div>
                <button
                  disabled={loading}
                  onClick={handleApplyFilter}
                  className="w-40 font-[600] h-10 border border-black rounded-md hover:bg-[#c4c4c4]"
                >
                  {loading ? (
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
                  ) : (
                    "Apply Filter"
                  )}
                </button>
              </div>
              <div className="flex flex-col mb-4 items-start">
                <div>
                  <CustomDropdown
                    buttonWidth="40rem"
                    showColors
                    labelClassName="mb-0"
                    className={"flex items-center gap-2"}
                    input={{
                      label: "X-axis unmet need select",
                      name: "X-axis unmet need select",
                      type: "select",
                      options: filterOutLabels(
                        filterOptions,
                        selectedUnmet
                      ).map((item) => ({
                        name: selectLabels[item] ? selectLabels[item] : item,
                        value: item,
                      })),
                      id: "xLabel",
                    }}
                    value={state.xLabel}
                    handleSelect={(val) => handleSelect("xLabel", val)}
                  />
                </div>
                <div>
                  <CustomDropdown
                    buttonWidth="40rem"
                    showColors
                    labelClassName="mb-0"
                    className={"flex items-center gap-2"}
                    input={{
                      label: "Y-axis unmet need select",
                      name: "Y-axis unmet need select",
                      type: "select",
                      options: filterOutLabels(
                        filterOptions,
                        selectedUnmet
                      ).map((item) => ({
                        name: selectLabels[item] ? selectLabels[item] : item,
                        value: item,
                      })),
                      id: "yLabel",
                    }}
                    value={state.yLabel}
                    handleSelect={(val) => handleSelect("yLabel", val)}
                  />
                </div>
              </div>
            </>
          )}

          <ScatterChart
            type="HCP"
            scatterValue={scatterValue}
            setHcpProfilePage={setHcpProfilePage}
            setIsScatterMapOpen={setIsScatterMapOpen}
            quadrantValues={quadrantValues}
            lineX={lineX}
            handleDispatchData={handleDispatchData}
            lineY={lineY}
            setLineX={setLineX}
            state={state}
            setLineY={setLineY}
            data={state.data}
          />
        </>
      ) : (
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
      )}
    </div>
  );
};

export default MedicalAffairToolbox;
