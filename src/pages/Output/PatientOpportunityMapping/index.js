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
  const [region, setRegion] = useState(null);
  const [state, dispatch] = useReducer(reducer, Initial_State);
  const { accessToken, refreshToken } = useContext(AuthContext);
  const [regionData, setRegionData] = useState(null);
  const [stateData, setStateData] = useState(null);
  const [mapStateData, setMapStateData] = useState(null);
  const [markedStates, setMarkedStates] = useState(null);
  const [allStateMarkers, setAllStateMarkers] = useState(null);
  const currentStateClicked = useRef(null);
  const [currentToggle, setCurrentToggle] = useState(toggleBtns[0].id);

  const [loading, setLoading] = useState(true);

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
  }, []);

  useEffect(() => {
    if (stateData) {
      setLoading(false);
    }
  }, [stateData]);

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

  const handleStateLevelData = async (_state, clickedState) => {
    // if (
    //   _state.states &&
    //   _state.states[_state.currentRegion] &&
    //   _state.states[_state.currentRegion][clickedState]
    // ) {
    //   setMarkedStates(_state.states[_state.currentRegion][clickedState]);
    // } else {
      try {
        const res = await getDataStats(
          `hcp_map_data?state=${clickedState}`,
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
    // }
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

    var newFilteredArray = filteredFeatures.map((item) => {
      return {
        ...item,
        ..._statesId[item.properties.name],
      };
    });

    // Create a new GeoJSON FeatureCollection with the filtered features
    var filteredFeatureCollection = {
      type: "FeatureCollection",
      features: filteredFeatures,
    };
    setMapStateData(filteredFeatureCollection);
  };

  const stateClicked = (e, mapRef) => {
    const features = mapRef.current.queryRenderedFeatures(e.point, {
      layers: ["countries"],
    });

    if (features.length > 0) {
      const clickedState = features[0].properties;
      if (currentStateClicked.current == clickedState.name) {
        return;
      }
      console.log("heree ");
      currentStateClicked.current = clickedState.name;
      handleStateLevelData(state, clickedState.name);
    }

    mapRef.current.flyTo({
      center: e.lngLat,
      zoom: 5,
      essential: true,
    });
  };

  const handleToggle = (id) => {
    setCurrentToggle(id);
  };

  return (
    <div>
      <div
        style={{ display: loading ? "grid" : "none" }}
        className="w-full h-[400px] grid place-content-center"
      >
        <div class="flex justify-center items-center h-24">
          <div class="w-6 h-6 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
      <div style={{ opacity: loading ? 0 : 1 }}>
        <div className="gap-5 cursor-pointer flex py-2">
          {toggleBtns.map((btn) => {
            return (
              <div
                onClick={() => handleToggle(btn.id)}
                className={`${
                  btn.id == currentToggle ? "bg-[#c3c3c3]" : "bg-[transparent]"
                } hover:bg-[#c3c3c3] px-1`}
              >
                {btn.label}
              </div>
            );
          })}
        </div>
        <Map
          currentToggle={currentToggle}
          stateClicked={stateClicked}
          stateData={stateData}
          markedStates={markedStates}
          mapStateData={mapStateData}
          markerClickedFn={markerClicked}
          markers={regionData}
          handleStateLevelData={handleStateLevelData}
          markersEnabled={false}
        />
        <div className="text-md font-medium mt-4">
          Summary of nation suboptimal treatment and trends over time
        </div>
        <div className="grid grid-cols-2 ">
          <BarChart />
          <BarChart data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default PatientOpportunityMapping;
