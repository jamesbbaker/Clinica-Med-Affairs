import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { getDataStats } from "../../API/Outputs";
import { AuthContext } from "../../context/AuthContext";
import { selectLabels } from "../../constants/appConstants";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const datasets = [
  {
    label: "Segment 1",
    data: [0.2, 0.9, 0.3, 0.5, 0.2, 0.3, 0.2, 0.5],
    backgroundColor: "rgba(255, 99, 132, 0.2)",
    borderColor: "rgba(255, 99, 132, 1)",
    borderWidth: 1,
  },
  {
    label: "Segment 2",
    data: [0.52, 0.33, 0.42, 0.53, 0.59, 0.81, 0.3, 0.5],
    backgroundColor: "rgba(93, 245, 112, 0.2)",
    borderColor: "rgba(93, 245, 112, 1)",
    borderWidth: 1,
  },
  {
    label: "Segment 3",
    data: [0.865, 0.312, 0.542, 0.177, 0.629, 0.444, 0.3, 0.9],
    backgroundColor: "rgba(132, 43, 209, 0.2)",
    borderColor: "rgba(132, 43, 209, 1)",
    borderWidth: 1,
  },
  {
    label: "Segment 4",
    data: [0.158, 0.793, 0.509, 0.645, 0.365, 0.234, 0.3, 0.1],
    backgroundColor: "rgba(201, 88, 113, 0.2)",
    borderColor: "rgba(201, 88, 113, 1)",
    borderWidth: 1,
  },
];

const options = {
  layout: {
    padding: {
      left: 100, // Adjust the left padding as needed
      right: 100, // Adjust the right padding as needed
    },
  },
  plugins: {
    datalabels: {
      display: false,
    },
  },
};

export const data = {
  labels: [
    "Failure to escalate therapy",
    "Failure to manage AEs",
    "High AH risk with no anticoagulant",
    "High AH risk with no anticoagulant",
    "Lack of monitoring by CV specialist",
    "Non-adherence to anticoagulants",
    "Non-adherence to other drug treatments",
    "Suboptimal CV risk testing",
  ],
  datasets: [datasets[0]],
};

export function RadarChart() {
  const chartRef = useRef(null);
  const { accessToken, refreshToken } = useContext(AuthContext);
  const [clusteringResult, setClusteringResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [
      "Failure to escalate therapy",
      "Failure to manage AEs",
      "High AH risk with no anticoagulant",
      "High AH risk with no anticoagulant",
      "Lack of monitoring by CV specialist",
      "Non-adherence to anticoagulants",
      "Non-adherence to other drug treatments",
      "Suboptimal CV risk testing",
    ],
    datasets: [datasets[0]],
  });

  const handleChange = (e) => {
    fetchData(e.target.value);
  };

  const colors = [
    {
      backgroundColor: "rgba(237, 45, 102, 0.2)",
      borderColor: "rgba(237, 45, 102, 1)",
    },
    {
      backgroundColor: "rgba(56, 194, 172, 0.2)",
      borderColor: "rgba(56, 194, 172, 1)",
    },
    {
      backgroundColor: "rgba(123, 84, 240, 0.2)",
      borderColor: "rgba(123, 84, 240, 1)",
    },
    {
      backgroundColor: "rgba(210, 116, 29, 0.2)",
      borderColor: "rgba(210, 116, 29, 1)",
    },
    {
      backgroundColor: "rgba(98, 172, 73, 0.2)",
      borderColor: "rgba(98, 172, 73, 1)",
    },
    {
      backgroundColor: "rgba(145, 62, 200, 0.2)",
      borderColor: "rgba(145, 62, 200, 1)",
    },
    {
      backgroundColor: "rgba(250, 133, 34, 0.2)",
      borderColor: "rgba(250, 133, 34, 1)",
    },
    {
      backgroundColor: "rgba(67, 209, 179, 0.2)",
      borderColor: "rgba(67, 209, 179, 1)",
    },
    {
      backgroundColor: "rgba(34, 96, 188, 0.2)",
      borderColor: "rgba(34, 96, 188, 1)",
    },
    {
      backgroundColor: "rgba(200, 154, 87, 0.2)",
      borderColor: "rgba(200, 154, 87, 1)",
    },
  ];

  const fetchData = (clusterVal) => {
    setLoading(true);
    getDataStats(
      `hcp_clustering?Clusters=${clusterVal}`,
      accessToken,
      refreshToken
    ).then((res) => {
      setClusteringResult(res.clustering_results);
      let _Data = [];
      let clusterArray = Array.from({ length: clusterVal }, (v, i) => i);
      clusterArray.forEach((item, index) => {
        let _array = [];

        let selectLabelsKeys = Object.keys(selectLabels)
          .filter((item) => res.clustering_results.hasOwnProperty(item))
          .map((item) => {
            return res.clustering_results[item];
          });

        selectLabelsKeys.forEach((item) => {
          _array.push(item[index]["Average Percent of Patients"].toFixed(2));
        });
        _Data.push({
          label: `Segment ${index + 1}`,
          data: _array,
          backgroundColor: colors[index].backgroundColor,
          borderColor: colors[index].borderColor,
          borderWidth: 1,
        });
      });
      setLoading(false);
      setChartData({
        labels: Object.keys(res.clustering_results).map(
          (item) => selectLabels[item]
        ),
        datasets: _Data,
      });
    });
  };

  useEffect(() => {
    fetchData(3);
  }, []);

  return (
    <div className="w-full flex flex-col items-left gap-2 py-2">
      <div className="text-sm font-medium">HCP segmentation</div>
      <div className="relative mt-2 flex items-center gap-5 mb-10">
        <div>
          <label className="text-xs" htmlFor="labels-range-input">
            Number of clusters
          </label>
        </div>
        <div className="relative">
          <input
            id="labels-range-input"
            type="range"
            onChange={handleChange}
            defaultValue={3}
            min={1}
            max={10}
            step={1}
            className="w-40 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">
            1
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-1/10  -bottom-6">
            2
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-2/10  -bottom-6">
            3
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-3/10  -bottom-6">
            4
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-4/10  -bottom-6">
            5
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-5/10  -bottom-6">
            6
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-6/10  -bottom-6">
            7
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-7/10  -bottom-6">
            8
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-8/10  -bottom-6">
            9
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">
            10
          </span>
        </div>
      </div>
      <div className="w-full self-center">
        {clusteringResult && !loading ? (
          <Radar ref={chartRef} options={options} data={chartData} />
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
    </div>
  );
}
