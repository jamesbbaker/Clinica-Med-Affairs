import React, { useContext, useEffect, useReducer, useState } from "react";
import ScatterChart from "../../../components/ScatterChart";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import { highestValue } from "../../../utils/MathUtils";
import SelectBox from "../../../components/SelectBox";
import { MultiSelect } from "react-multi-select-component";

const filterOptions = [
  "Number of Asthma Patients",
  "Number of ICS Patients",
  "Number of ICS Exacerbation",
  "Number of ICS-LABA Patients",
  "Number of ICS-LABA Exacerbation",
  "Number of No Spirometry",
  "Percent of No Spirometry",
  "Number of No EOS Testing",
  "Percent of No EOS Testing",
  "Number of No Treatment",
  "Percent of No Treatment",
  "Number of ICS High Steroid Usage",
  "Percent of ICS High Steroid Usage",
  "Number of ICS Exacerbation Failed Escalation",
  "Percent of ICS Exacerbation Failed Escalation",
  "Number of ICS Escalation Delay",
  "Percent of ICS Escalation Delay",
  "Number of ICS-LABA High Steroid Usage",
  "Percent of ICS-LABA High Steroid Usage",
  "Number of ICS-LABA Exacerbation Failed Escalation",
  "Percent of ICS-LABA Exacerbation Failed Escalation",
  "Number of ICS-LABA Escalation Delay",
  "Percent of ICS-LABA Escalation Delay",
];

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
          bottomLeft+=1
        } else if (item.x >= lineX && item.y < lineY) {
          bottomRight+=1
        } else if (item.x < lineX && item.y >= lineY) {
          topLeft+=1
        } else {
          topRight+=1
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
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
    return scatterData;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelect = (e) => {
    dispatch({
      type: actions.handleUpdate,
      payload: {
        [e.target.id]: e.target.value,
      },
    });
    let labelValue = {
      xLabel: e.target.id == "xLabel" ? e.target.value : state.xLabel,
      yLabel: e.target.id == "yLabel" ? e.target.value : state.yLabel,
    };
    let data = handleChartData(rawData, labelValue);
    dispatch({
      type: actions.handleUpdateData,
      payload: data,
    });
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
              <SelectBox
                labelClassName="mb-0"
                className={"flex items-center gap-2"}
                input={{
                  label: "X-axis unmet need select",
                  name: "X-axis unmet need select",
                  type: "select",
                  options: filterOptions.map((item) => ({
                    id: item,
                    name: item,
                  })),
                  id: "xLabel",
                }}
                value={state.xLabel}
                handleSelect={(val) => handleSelect(val)}
              />
            </div>
            <div>
              <SelectBox
                labelClassName="mb-0"
                className={"flex items-center gap-2"}
                input={{
                  label: "Y-axis unmet need select",
                  name: "Y-axis unmet need select",
                  type: "select",
                  options: filterOptions.map((item) => ({
                    id: item,
                    name: item,
                  })),
                  id: "yLabel",
                }}
                value={state.yLabel}
                handleSelect={(val) => handleSelect(val)}
              />
            </div>
          </div>

          <ScatterChart
          quadrantValues={quadrantValues}
            lineX={lineX}
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
