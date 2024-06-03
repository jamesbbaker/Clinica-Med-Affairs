import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import BarChart from "../../../components/BarChart";
import Map from "../../../components/Map";
import { AuthContext } from "../../../context/AuthContext";
import { getDataStats } from "../../../API/Outputs";
import mapDataJson from "../../../components/Map/data.json";
import SelectBox from "../../../components/SelectBox";
import {
  mapLabels,
  patientTotals,
  selectLabels,
} from "../../../constants/appConstants";
import CustomDropdown from "../../../components/CustomDropdown";
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
        callback: function (value, index, ticks) {
          return `${value}%`;
        },
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

const Initial_State = {
  currentRegion: null,
};

const action_types = {
  HandleAddStates: "handleAddStates",
  HandleUpdateCurrentRegion: "handleUpdateCurrentRegion",
  HandleUpdateStates: "handleUpdateStates",
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case action_types.HandleAddStates:
      return {
        ...state,
        states: payload,
      };
    case action_types.HandleUpdateStates:
      let _state = { ...state };
      let _currentRegionData =
        _state.states && _state.states[_state.currentRegion]
          ? _state.states[_state.currentRegion]
          : {};
      let _allData = _currentRegionData
        ? { ..._currentRegionData, ...payload }
        : { ...payload };
      return {
        ..._state,
        states: {
          ..._state.states,
          [_state.currentRegion]: _allData,
        },
      };
    case action_types.HandleUpdateCurrentRegion:
      return {
        ...state,
        currentRegion: payload,
      };
    default:
      return {
        ...state,
        ...payload,
      };
  }
};

const toggleBtns = [
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
].map((item) => ({
  label: item,
  id: item,
}));

let data_1_labels = [
  "Total Asthma Patients",
  "Total ICS Patients",
  "Total ICS Exacerbations",
  "Total ICS-LABA Patients",
  "Total ICS-LABA Exacerbations",
  "Total No Spirometry",
  "Total No EOS Testing",
  "Total No Treatment",
  "Total ICS High Steroid Usage",
  "Total ICS Exacerbation Failed Escalation",
  "Total ICS Escalation Delay",
  "Total ICS-LABA High Steroid Usage",
  "Total ICS-LABA Exacerbation Failed Escalation",
  "Total ICS-LABA Escalation Delay",
];
let data_2_labels = [
  "Percent Asthma Patients",
  "Percent ICS Patients",
  "Percent ICS Exacerbations",
  "Percent ICS-LABA Patients",
  "Percent ICS-LABA Exacerbations",
  "Percent No Spirometry",
  "Percent No EOS Testing",
  "Percent No Treatment",
  "Percent ICS High Steroid Usage",
  "Percent ICS Exacerbation Failed Escalation",
  "Percent ICS Escalation Delay",
  "Percent ICS-LABA High Steroid Usage",
  "Percent ICS-LABA Exacerbation Failed Escalation",
  "Percent ICS-LABA Escalation Delay",
];

const PatientOpportunityMapping = () => {
  const [currentLevel, setCurrentLevel] = useState("region");
  const [state, dispatch] = useReducer(reducer, Initial_State);
  const { accessToken, refreshToken } = useContext(AuthContext);
  const [regionData, setRegionData] = useState(null);
  const [data1, setData1] = useState();
  const [data2, setData2] = useState();
  const [stateData, setStateData] = useState(null);
  const [markedStates, setMarkedStates] = useState(null);
  const currentStateClicked = useRef(null);
  const [currentToggle, setCurrentToggle] = useState(toggleBtns[0].id);
  const [loading, setLoading] = useState(true);
  const [resetMap, setResetMap] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    getDataStats("region_level_data", accessToken, refreshToken)
      .then((res) => {
        if (res) {
          console.log(res);
          // let _data = JSON.parse(res.replaceAll("NaN", 0));
          setRegionData(res.data);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
    getDataStats("state_level_data", accessToken, refreshToken)
      .then(async (res) => {
        if (res) {
          let _data = JSON.parse(res.replaceAll("NaN", 0));
          let StateByRegion = {};
          _data.data.map((entry) => {
            if (entry.Region != 0) {
              if (
                StateByRegion[entry.Region] &&
                StateByRegion[entry.Region].length > 0
              ) {
                StateByRegion[entry.Region].push(entry);
              } else {
                StateByRegion[entry.Region] = [entry];
              }
            }
          });

          setStateData(StateByRegion);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
    getDataStats("national_data", accessToken, refreshToken).then(
      async (res) => {
        if (res) {
          setChartDataValue(setData1, data_1_labels, [res.summary_data]);
          setChartDataValue(setData2, data_2_labels, [res.summary_data]);
          setSummaryData([res.summary_data]);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (stateData) {
      setLoading(false);
    }
  }, [stateData]);

  const handleStateLevelData = async (_state, clickedState) => {
    try {
      const res = await getDataStats(
        `hcp_map_data?state=${clickedState.trim()}`,
        accessToken,
        refreshToken
      );
      if (res) {
        let _data = JSON.parse(res.replaceAll("NaN", 0));
        dispatch({
          type: action_types.HandleUpdateStates,
          payload: { [clickedState]: _data.data },
        });

        setMarkedStates(_data.data);
      }
    } catch (err) {
      console.log(err, "err");
    }
  };

  const markerClicked = async (e) => {
    if (!stateData) {
      return;
    }
    let _region = e.Region;
    dispatch({
      type: action_types.HandleUpdateCurrentRegion,
      payload: _region,
    });
    let states = stateData[e.Region];
    let _statesId = {};
    states.map((item) => {
      return (_statesId[item["State Name"]] = item);
    });
    var filteredFeatures = mapDataJson.features.filter(function (feature) {
      return _statesId.hasOwnProperty(feature.properties.name);
    });

    // Create a new GeoJSON FeatureCollection with the filtered features
    var filteredFeatureCollection = {
      type: "FeatureCollection",
      features: filteredFeatures,
    };

    let _filteredArray = regionData.filter(
      (item) => item["Region"] === _region
    );
    setChartDataValue(setData1, data_1_labels, _filteredArray);
    setChartDataValue(setData2, data_2_labels, _filteredArray);
  };

  function setChartDataValue(setValue, API_labels, data) {
  
    let _value = [];
    API_labels.forEach((item) => {
      _value.push(data[0][item]);
    });
    let chartData = {
      labels: API_labels.map((item) => selectLabels[mapLabels[item]]),
      datasets: [
        {
          data: _value,
          borderColor: API_labels.map((item) =>
            !patientTotals.includes(item) ? "#800000" : "#00008B"
          ),
          backgroundColor: API_labels.map((item) =>
            !patientTotals.includes(item) ? "#800000" : "#00008B"
          ),
        },
      ],
    };
    setValue(chartData);
  }

  const stateClicked = (feature, mapRef) => {
    const clickedState = feature["State Name"];
    if (currentStateClicked.current == clickedState) {
      return;
    }
    currentStateClicked.current = clickedState;
    const _Region = feature["Region"];
    let _filteredArray = stateData[_Region].filter(
      (item) => item["State Name"] === clickedState
    );
    setChartDataValue(setData1, data_1_labels, _filteredArray);
    setChartDataValue(setData2, data_2_labels, _filteredArray);

    handleStateLevelData(state, clickedState);

    mapRef.current.flyTo({
      center: [feature.LONG, feature.LAT],
      zoom: 7,
      essential: true,
    });
  };

  const handleReset = () => {
    setResetMap(true);
    setTimeout(() => {
      setResetMap(false);
      setCurrentLevel("region");
      setCurrentToggle(toggleBtns[0].id);
      setMarkedStates(null);
      currentStateClicked.current = null;
      setChartDataValue(setData1, data_1_labels, summaryData);
      setChartDataValue(setData2, data_2_labels, summaryData);
    }, 100);
  };

  const handleToggle = (e) => {
    console.log(e);
    setCurrentToggle(e);
  };

  return (
    <div>
      <div
        style={{ display: loading ? "grid" : "none" }}
        className="w-full h-[400px] grid place-content-center"
      >
        <div className="flex justify-center items-center h-24">
          <div className="w-6 h-6 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
      <div className="text-md font-medium mt-4">
        National Summary of Unmet Needs
      </div>
      <div className="flex items-center w-full justify-center">
        {data1 && (
          <div className="w-[60%]">
            <BarChart data={data1} />
         
          </div>
        )}
        {/* {data2 && <BarChart data={data2} options={options} />} */}
      </div>
      <div style={{ opacity: loading ? 0 : 1 }}>
        <div className="flex items-center justify-between">
          <div
            onClick={handleReset}
            className="font-500 cursor-pointer hover:bg-[#c3c3c3] p-1 border border-[#000]"
          >
            RESET MAP
          </div>
          <div className="flex mb-6 items-center gap-8">
            <CustomDropdown
              labelClassName="mb-0"
              className={"flex items-center"}
              showColors={true}
              input={{
                label: "Select Unmet Needs",
                id: "unmet",
                options: toggleBtns.map((item) => ({
                  name: selectLabels[item.id],
                  value: item.label,
                })),
              }}
              handleSelect={(e) => handleToggle(e)}
              value={currentToggle}
            />
          </div>
        </div>
        {resetMap ? (
          <div
            style={{ display: loading ? "grid" : "none" }}
            className="w-full h-[400px] grid place-content-center"
          >
            <div className="flex justify-center items-center h-24">
              <div className="w-6 h-6 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <Map
            currentLevel={currentLevel}
            setCurrentLevel={setCurrentLevel}
            currentToggle={currentToggle}
            stateClicked={stateClicked}
            stateData={stateData}
            markedStates={markedStates}
            markerClickedFn={markerClicked}
            markers={regionData}
            markersEnabled={false}
          />
        )}
      </div>
    </div>
  );
};

export default PatientOpportunityMapping;
