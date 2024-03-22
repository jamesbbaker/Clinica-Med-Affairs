import { useEffect, useRef, useState } from "react";
import { Chart } from "react-chartjs-2";
import * as ChartGeo from "chartjs-chart-geo";
import {
  Chart as ChartJS,
  CategoryScale,
  Tooltip,
  Title,
  Legend,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  ChartGeo.ChoroplethController,
  ChartGeo.ProjectionScale,
  ChartGeo.ColorScale,
  ChartGeo.GeoFeature
);

export default function Map() {
  const chartRef = useRef();
  const [data, setData] = useState([]);
  const [area, setArea] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/us-atlas/states-10m.json")
      .then((r) => r.json())
      .then((value) => {
        const _data = value.objects.states.geometries.map((_d) => {
          let obj = {
            value: Math.random(),
            feature: ChartGeo.topojson
              .feature(value, value?.objects?.states)
              .features.find((d) => d.properties.name === _d.properties.name),
          };
          return obj;
        });
        const _value = value.objects.states.geometries.map(
          (d) => d.properties.name
        );
        setLabels([..._value]);
        setArea([..._data]);
        setData(value);
      });
  }, []);

  return (
    <div className="px-6 py-8 border border-slate-200 shadow-box-2 rounded-lg">
      <div className="font-medium mb-4">MAP</div>

      {data &&
        data.objects &&
        data.objects.nation &&
        data.objects.states &&
        area.length > 0 &&
        labels.length > 0 && (
          <Chart
            height={100}
            ref={chartRef}
            type="choropleth"
            data={{
              labels: [...labels],
              datasets: [
                {
                  label: "States",
                  outline: ChartGeo.topojson.feature(
                    data,
                    data?.objects?.nation
                  ).features[0], // ... outline to compute bounds
                  showOutline: true,
                  data: [...area],
                },
              ],
            }}
            options={{
              showOutline: true,
              showGraticule: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                xy: {
                  projection: "equalEarth",
                },
                // // Hide color scale
                // color: {
                //   display: false,
                // },
              },
            }}
          />
        )}
    </div>
  );
}
