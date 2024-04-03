import React from "react";
import { LineChart } from "../../../components/LineChart";
import Map from "../../../components/Map";
import TreeMap from "../../../components/TreeMap";

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
        autoSkip: false,
        callback: function (value) {
          return value;
        },
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

const active = {
  name: "GDP",
  description: "Estimate total GDP in millions of dollars",
  property: "density",
  stops: [
    [0, "#ffef96"],
    [10, "#ffd073"],
    [50, "#ffae73"],
    [100, "#ff8e73"],
    [500, "#ff6e73"],
    [1000, "#ff5073"],
    [2500, "#ff3373"],
    [50000, "#ff1973"],
    [100000, "#d2177a"],
  ],
};

function MapAddLayerFn(map, data) {
  map.on("load", () => {
    map.addSource("countries", {
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

    map.setLayoutProperty("country-label", "text-field", [
      "format",
      ["get", "name_en"],
      { "font-scale": 1.2 },
      "\n",
      {},
      ["get", "name"],
      {
        "font-scale": 0.8,
        "text-font": [
          "literal",
          ["DIN Offc Pro Italic", "Arial Unicode MS Regular"],
        ],
      },
    ]);

    map.addLayer(
      {
        id: "countries",
        type: "fill",
        source: "countries",
      },
      firstSymbolId
    );

    map.setPaintProperty("countries", "fill-color", {
      property: active.property,
      stops: active.stops,
    });
    // Add country hover layer
    map.addLayer(
      {
        id: "country-fills-hover",
        type: "fill",
        source: "countries",
        layout: {},
        paint: {
          "fill-color": "#000000",
          "fill-opacity": 0.3,
        },
        filter: ["==", "name", ""],
      },
      firstSymbolId
    );

    // Add country hover effect
    map.on("mousemove", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["countries"],
      });

      if (features.length) {
        map.getCanvas().style.cursor = "pointer";
        map.setFilter("country-fills-hover", [
          "==",
          "name",
          features[0].properties.name,
        ]);
      } else {
        map.setFilter("country-fills-hover", ["==", "name", ""]);
        map.getCanvas().style.cursor = "";
      }
    });

    // Add country un-hover effect
    map.on("mouseout", () => {
      map.getCanvas().style.cursor = "auto";
      map.setFilter("country-fills-hover", ["==", "name", ""]);
    });

    // Add country onclick effect
    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["countries"],
      });
      if (!features.length) return;
      const { properties } = features[0];
      const { property, description } = active;
      alert(`(${properties.name}) ${properties[property]} ${description}`);
    });
  });

  // Render custom marker components
}

const ImpactTracking = () => {
  return (
    <div className="pb-20 flex flex-col gap-8 h-34">
      <LineChart options={options} data={data} arbitrary={false} />
      <Map LayerFn={MapAddLayerFn} markersEnabled={false} />
      <TreeMap />
    </div>
  );
};

export default ImpactTracking;
