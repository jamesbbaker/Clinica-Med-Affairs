import React, { useContext, useEffect, useReducer, useState } from "react";
import ScatterChart from "../../../components/ScatterChart";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import { highestValue } from "../../../utils/MathUtils";
import SelectBox from "../../../components/SelectBox";
import { MultiSelect } from "react-multi-select-component";
import CustomDropdown from "../../../components/CustomDropdown";
import { selectLabels } from "../../../constants/appConstants";

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

const MedicalAffairToolbox = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { accessToken, refreshToken } = useContext(AuthContext);
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
      state.data.datasets[0].data.map((item) => {
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
    let queryString = `institutional_variation_data?&`; // Start with 'hcp_data?&'

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
      return "square";
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

      value: item[radius],
    }));

    let scatterData = {
      datasets: [
        {
          label: "HCP Profiles",
          data: data.map((item) => ({
            name: item["Assigned Physician Name"],
            x: item[vabelValues.xLabel],
            y: item[vabelValues.yLabel],
            r: calculateRadius(item[radius], maxValue),
            value: item[radius],
          })),
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
          shape: _data.map((item) => generateShape(item["Primary Specialty Description"])),
          // borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
    return scatterData;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDispatchData = (labelValue, chartData) => {
    let _data = chartData ? chartData : rawData;
    let data = handleChartData(rawData, labelValue);
    dispatch({
      type: actions.handleUpdateData,
      payload: data,
    });
  };

  const handleSelect = (id, val) => {
    dispatch({
      type: actions.handleUpdate,
      payload: {
        [id]: val,
      },
    });

    let labelValue = {
      xLabel: id == "xLabel" ? val : state.xLabel,
      yLabel: id == "yLabel" ? val : state.yLabel,
    };
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
    <div className="flex flex-col gap-2 items-start">
      <div className="text-[1.25rem] font-[600]">HCP Prioritization</div>
      {state.data ? (
        <>
          <div className="flex items-center w-full justify-between">
            <div className="flex items-center gap-8">
              <div className="font-[600] text-[18px]">Filters:</div>
              {state.regionList && (
                <div className="flex items-center gap-4">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
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
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Primary Select
                  </label>
                  <MultiSelect
                    labelledBy=""
                    options={state.primaryList.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                    className="w-[10rem] z-[5]"
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
                <div className="flex bg-[#c4c4c4] w-full h-full justify-center items-center">
                  <div className="w-6 h-6 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                "Apply Filter"
              )}
            </button>
          </div>
          <div className="flex flex-col mb-4 items-start">
            <div>
              <CustomDropdown
                showColors
                labelClassName="mb-0"
                className={"flex items-center gap-2"}
                input={{
                  label: "X-axis unmet need select",
                  name: "X-axis unmet need select",
                  type: "select",
                  options: filterOptions.map((item) => ({
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
                showColors
                labelClassName="mb-0"
                className={"flex items-center gap-2"}
                input={{
                  label: "Y-axis unmet need select",
                  name: "Y-axis unmet need select",
                  type: "select",
                  options: filterOptions.map((item) => ({
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

          <ScatterChart
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
          <div className="flex justify-center items-center h-24">
            <div className="w-6 h-6 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalAffairToolbox;
