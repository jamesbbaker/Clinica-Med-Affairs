import React, { useContext, useEffect, useState } from "react";
import { LineChart } from "../../../components/LineChart";
import Map from "../../../components/Map";
import TreeMap from "../../../components/TreeMap";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import { mapLabels, selectLabels } from "../../../constants/appConstants";
import CustomDropdown from "../../../components/CustomDropdown";
import { MultiSelect } from "react-multi-select-component";
import { getRandomInt } from "../../../utils/MathUtils";
import ImpactLineChart from "./ImpactLineChart";
import ImpactMap from "./ImpactMap";

const filterOptions = [...Object.keys(selectLabels)];

export const options = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: false,
      },

      grid: {
        display: false,
      },
      // grid: {
      //   drawOnChartArea: false,
      //   drawOnAxisArea: false,
      // },
      ticks: {
        // stepSize: 1,
        // min: 0,
        // autoSkip: false,
        // callback: function (value) {
        //   return value;
        // },
      },
    },
    y: {
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
      position: "top",
    },
  },
};

function generateValues() {
  const values = [];
  const maxIndex = 10;

  for (let i = 0; i < maxIndex; i++) {
    values.push(Math.floor(Math.random() * maxIndex));
  }

  return values;
}
const labels = Array.from({ length: 10 }, (_, i) => i);

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: generateValues(),
      borderColor: "rgb(15,255, 122)",
      backgroundColor: "rgb(15,255, 122, 0.2)",
    },
    {
      label: "Dataset 2",
      data: generateValues(),
      borderColor: "rgb(150,25, 152)",
      backgroundColor: "rgb(150,25, 152, 0.2)",
    },
  ],
};
const defaultActive = {
  name: "GDP",
  description: "Estimate total GDP in millions of dollars",
  property: "density",
  stops: [
    [2740504, "#ffef96"],
    [13103255, "#ff6e73"],
    [29285938, "#d2177a"],
  ],
};

function MapAddLayer(
  map,
  data,
  markerClicked,
  loaded = false,
  removeOldLayer = false,
  layerId = "countries",
  _layerAdded,
  dataQuality = false,
  setLayerAdded = () => {}
) {
  function LayerAddition() {
    // Remove all layers

    map.addSource(layerId, {
      type: "geojson",
      data: data,
    });
    const layers = map.getStyle().layers;
    // Find the index of the first symbol layer in the map style.
    let firstSymbolId;
    for (const layer of layers) {
      if (layer.type === "symbol") {
        firstSymbolId = layer.id;
        break;
      }
    }

    map.addLayer(
      {
        id: layerId,
        type: "fill",
        source: layerId,
      },
      firstSymbolId
    );

    map.setPaintProperty(layerId, "fill-color", {
      property: defaultActive.property,
      stops: defaultActive.stops,
    });

    map.addLayer({
      id: "country-fills-hover",
      type: "fill",
      source: layerId,
      layout: {},
      paint: {
        "fill-color": "#000000",
        "fill-opacity": 0.2,
      },
      filter: ["==", "name", ""],
    });
    setLayerAdded(true);

    // Add country hover effect
    map.on("mousemove", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [layerId],
      });
      const feature = features[0];
      if (features.length) {
        map.getCanvas().style.cursor = "pointer";
        map.setFilter("country-fills-hover", [
          "==",
          "name",
          features[0].properties.name,
        ]);
        // popup.setHTML(
        //   `<strong>${feature.properties.density.toLocaleString()}</strong>`
        // );

        // // Display the popup at the mouse pointer's location
        // popup.setLngLat(e.lngLat).addTo(map);
      } else {
        map.setFilter("country-fills-hover", ["==", "name", ""]);
        map.getCanvas().style.cursor = "";
      }
    });

    // Add country un-hover effect
    map.on("mouseout", () => {
      map.getCanvas().style.cursor = "auto";
      // map.getCanvas().style.cursor = '';
      map.setFilter("country-fills-hover", ["==", "name", ""]);
    });

    // Add country onclick effect
  }
  if (loaded) {
    LayerAddition();
  } else {
    map.on("load", () => LayerAddition);
  }

  // Render custom marker components
}

const ImpactTracking = () => {
  const { accessToken, refreshToken } = useContext(AuthContext);

  const [nationalData, setNationalData] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const [stateData, setStateData] = useState(null);

  useEffect(() => {
    getDataStats("national_data_quarterly", accessToken, refreshToken).then(
      (res) => {
        let data = [];
        Object.entries(res.summary_data).map((item) =>
          data.push({ ...item[1], Quarter: item[0] })
        );
        setNationalData(data);
      }
    );

    getDataStats("state_level_quarterly", accessToken, refreshToken).then(
      (res) => {
        let data = JSON.parse(res.replaceAll(NaN, "0"));
        setStateData(data);
      }
    );
    getDataStats("region_level_quarterly", accessToken, refreshToken).then(
      (res) => {
        let data = JSON.parse(res.replaceAll(NaN, "0"));
     
        setRegionData(data);
      }
    );
  }, []);

  const [mapLoading, setMapLoading] = useState(false);

  const handleReset = () => {
    setMapLoading(true);
    setTimeout(() => {
      setMapLoading(false);
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <ImpactLineChart lineData={nationalData} />
      {regionData && (
        <ImpactLineChart type="Region" lineData={regionData.data} />
      )}
      {stateData && <ImpactLineChart type="State" lineData={stateData.data} />}
      {!mapLoading ? (
        <ImpactMap
          handleReset={handleReset}
          regionData={regionData}
          stateData={stateData}
        />
      ) : (
        <div className="h-[80vh] flex justify-center items-center">
          <div className="h-[200px] flex flex-col items-center justify-center">
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
        </div>
      )}
      {/* <div className="flex w-full flex-col items-start">
        <CustomDropdown
          showColors
          labelClassName="mb-0"
          className={"flex  mb-4 items-center gap-2"}
          input={{
            label: "Unmet Need select",
            name: "Unmet Need select",
            type: "select",
            options: filterOptions.map((item) => ({
              name: selectLabels[item] ? selectLabels[item] : item,
              value: item,
            })),
            id: "xLabel",
          }}
          handleSelect={(val) => handleSelectTree(val)}
          value={unmetNeed}
        />
      </div> */}
    </div>
  );
};

export default ImpactTracking;
