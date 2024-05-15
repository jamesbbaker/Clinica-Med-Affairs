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
  {
    label: "Number of High Steroid Usage Patients",
    id: "Number of High Steroid Usage Patients",
  },
  {
    label: "Number of Severe Exacerbations",
    id: "Number of Severe Exacerbations",
  },
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
  const [resetMap,setResetMap] = useState(false)
  const [summaryData, setSummaryData] = useState(null)



  useEffect(() => {
    getDataStats("region_level_data", accessToken, refreshToken)
      .then((res) => {
        if (res) {
          let _data = JSON.parse(res.replaceAll("NaN", 0));
          setRegionData(_data.data);
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
    getDataStats("national_data", accessToken, refreshToken).then(async (res) => {
      if (res) { 
        let data_1_labels = [
          "Total High Steroid Usage",
          "Total Severe Exacerbations",
        ];
        let data_2_labels = [
          "Percent High Steroid Usage",
          "Percent Severe Exacerbations",
        ];
        setChartDataValue(setData1, data_1_labels, [res.summary_data]);
        setChartDataValue(setData2, data_2_labels, [res.summary_data]);
        setSummaryData([res.summary_data])
      }
    })
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
    let data_1_labels = [
      "Total High Steroid Usage",
      "Total Severe Exacerbations",
    ];
    let data_2_labels = [
      "Percent High Steroid Usage",
      "Percent Severe Exacerbations",
    ];
    setChartDataValue(setData1, data_1_labels, _filteredArray);
    setChartDataValue(setData2, data_2_labels, _filteredArray);
  };

  function setChartDataValue(setValue, API_labels, data) {
    let _value = [];
    API_labels.forEach((item) => {
      _value.push(data[0][item]);
    });
    let chartData = {
      labels: API_labels,
      datasets: [
        {
          data: _value,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
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
    let data_1_labels = [
      "Total High Steroid Usage",
      "Total Severe Exacerbations",
    ];
    let data_2_labels = [
      "Percent High Steroid Usage",
      "Percent Severe Exacerbations",
    ];
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
    setResetMap(true)
    setTimeout(() => {
      setResetMap(false)
      setCurrentLevel("region");
      setCurrentToggle(toggleBtns[0].id);
      setMarkedStates(null)
      currentStateClicked.current = null
      let data_1_labels = [
        "Total High Steroid Usage",
        "Total Severe Exacerbations",
      ];
      let data_2_labels = [
        "Percent High Steroid Usage",
        "Percent Severe Exacerbations",
      ];
      setChartDataValue(setData1, data_1_labels, summaryData);
      setChartDataValue(setData2, data_2_labels, summaryData);
    }, 100)
  }

  const handleToggle = (id) => {
    setCurrentToggle(id);
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
      <div style={{ opacity: loading ? 0 : 1 }} >
        <div className="flex items-center justify-between"><div onClick={handleReset} className="font-500 cursor-pointer hover:bg-[#c3c3c3] p-1 border border-[#000]">RESET MAP</div>
        <div className="gap-5 cursor-pointer flex py-2">
          {toggleBtns.map((btn) => {
            return (
              <div
              key={btn.label}
                onClick={() => handleToggle(btn.id)}
                className={`${
                  btn.id == currentToggle ? "bg-[#c3c3c3]" : "bg-[transparent]"
                } hover:bg-[#c3c3c3] p-1`}
              >
                {btn.label}
              </div>
            );
          })}
        </div>
        </div>
       {resetMap ? <div
        style={{ display: loading ? "grid" : "none" }}
        className="w-full h-[400px] grid place-content-center"
      >
        <div className="flex justify-center items-center h-24">
          <div className="w-6 h-6 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div> : <Map
          currentLevel={currentLevel}
          setCurrentLevel={setCurrentLevel}
          currentToggle={currentToggle}
          stateClicked={stateClicked}
          stateData={stateData}
          markedStates={markedStates}
          markerClickedFn={markerClicked}
          markers={regionData}
          markersEnabled={false}
        />}
        <div className="text-md font-medium mt-4">
        Summary of Asthma Medical Unmet Need
        </div>
        <div className="grid grid-cols-2 ">
          {data1 && <BarChart data={data1} />}
          {data2 && <BarChart data={data2} options={options} />}
        </div>
      </div>
    </div>
  );
};

export default PatientOpportunityMapping;
