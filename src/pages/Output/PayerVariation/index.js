import React, { useContext, useEffect, useMemo, useState } from "react";
import TreeMap from "../../../components/TreeMap";
import {
  EPL_TABLE_COLUMNS,
  mapBarCharts,
  mapLabels,
  mapSelectLabels,
  patientTotals,
  selectLabels,
} from "../../../constants/appConstants";
import { removeOrAddColumn } from "../../../utils/MapUtils";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import { MultiSelect } from "react-multi-select-component";
import Popup from "reactjs-popup";
import CustomDropdown from "../../../components/CustomDropdown";
import BarChartPopup from "../PatientOpportunityMapping/Popup";
import { getLowestValue, highestValue } from "../../../utils/MathUtils";
import PayerVariationBubbleChart from "./PayerVariationBubbleChart";

const filters = [...Object.keys(selectLabels)];

const PayerVariation = () => {
  const [TreeData, setTreeData] = useState(null);

  const [rawData, setRawData] = useState(null);
  const [toggleFilter, setToggleFilter] = useState(filters[0]);
  const [values, setValues] = useState({
    min: 0,
    max: 0,
  });
  const [treeDataById, setTreeDataById] = useState({});
  const [data1, setData1] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalDetails, setModalDetails] = useState({});

  function formatPercentage(value) {
    if (selectLabels[toggleFilter].includes("percent")) {
      return `${value.toFixed(1)}%`;
    } else {
      return value;
    }
  }

  const options1 = {
    enableHighlight: true,
    minColor: "#fff",
    maxDepth: 0,
    maxPostDepth: 0,
    // midColor: "#888",
    maxColor: "#FF0000",
    headerHeight: 15,
    fontColor: "black",
    title: "Asthma Patients by States",
    titleTextStyle: {
      color: "#888",
      textAlign: "center",
    },
    useWeightedAverageForAggregation: true,
    showScale: true,
    generateTooltip: (_row, _size, value) => {
      let hcpValue = TreeData[_row + 1];

      return `<div style="background:rgb(0 141 218);display: flex; align-items:center; flex-direction:column; color:#fff; padding:10px; border-style:solid, zIndex: 10"> 
    <div><strong>NAME</strong>:  ${hcpValue[0]}</div>
    <div><strong>Number of ICS-LABA Patients</strong>:  ${hcpValue[2]}</div>
    <div><strong>${selectLabels[toggleFilter]}</strong>:  ${formatPercentage(
        hcpValue[3]
      )}</div>
     </div>`;
    },
  };
  const options2 = {
    minColor: "#fff",
    // midColor: "#888",
    maxColor: "#FF0000",
    headerHeight: 15,
    fontColor: "black",
    title: "Asthma Patients by States",
    titleTextStyle: {
      color: "#888",
      textAlign: "center",
    },
    showScale: true,
    generateTooltip: (_row, _size, value) => {
      let hcpValue = TreeData[_row + 1];

      return `<div style="background:rgb(0 141 218);display: flex; align-items:center; flex-direction:column; color:#fff; padding:10px; border-style:solid, zIndex: 10"> 
    <div><strong>NAME</strong>:  ${hcpValue[0]}</div>
    <div><strong>Number of ICS-LABA Patients</strong>:  ${hcpValue[2]}</div>
    <div><strong>${selectLabels[toggleFilter]}</strong>:  ${formatPercentage(
        hcpValue[3]
      )}</div>
     </div>`;
    },
  };

  const { accessToken, refreshToken } = useContext(AuthContext);

  const handleTreeData = (data, toggleFilter, page) => {
    setLoading(true);

    if (data) {
      let treemapData = [
        [
          "Region",
          "Parent",
          "Number of ICS-LABA Patients (size)",
          "Number of Severe Exacerbations (color)",
        ],
        ["PAYER", null, 0, 0],
      ];
      let newObj = {};

      data.map((item, index) => {
        newObj[item.Item] = item;
        let newArr = [
          item.Item,
          item.Parent && item.Parent.toLowerCase() == "global"
            ? "PAYER"
            : item.Parent,
          item["Number of ICS-LABA Patients"],
          item[toggleFilter],
        ];
        treemapData.push(newArr);
      });
      setTreeDataById(newObj);
      setLoading(false);
      setTreeData(treemapData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (row, value, data) => {
    if (row === modalDetails.name) {
      return;
    }
    setShowModal(true);
    let _data = treeDataById[`${row}_Plan`];
    setChartDataValue(setData1, null, [_data]);
    setModalDetails(_data);
  };

  const handleToggleFilter = (e) => {
    setToggleFilter(e);
    handleTreeData(rawData, e);
  };

  const closeModal = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    setShowModal(false);
  };

  const fetchData = () => {
    let queryString = `payer_level_data?`; // Start with 'hcp_data?&'

    getDataStats(queryString, accessToken, refreshToken)
      .then((res) => {
        if (res) {
          let _data = JSON.parse(res.replaceAll("NaN", 0));
          setRawData(_data.data);
          if (_data) {
            let treemapData = [
              [
                "Region",
                "Parent",
                "Number of ICS-LABA Patients (size)",
                "Number of Severe Exacerbations (color)",
              ],
              ["PAYER", null, 0, 0],
            ];
            let newObj = {};
            let data = _data.data;
            let secondlevelData = data.filter(
              (item) => item.Parent && item.Parent.toLowerCase() !== "global"
            );
            let lowestValue = getLowestValue(secondlevelData, toggleFilter);
            let _highestValue = highestValue(secondlevelData, toggleFilter);
            setValues({
              min: lowestValue,
              max: _highestValue,
            });

            data.map((item, index) => {
              newObj[item.Item] = item;
              let newArr = [
                item.Item,
                item.Parent && item.Parent.toLowerCase() == "global"
                  ? "PAYER"
                  : item.Parent,
                item["Number of ICS-LABA Patients"],
                item[toggleFilter],
              ];
              treemapData.push(newArr);
            });
            setTreeDataById(newObj);
            let newArr = [];
            treemapData.map((item) => {
              if (!isNaN(item[3])) {
                newArr.push(item[3]);
              }
            });

            setTreeData(treemapData);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function setChartDataValue(setValue, API_labels, data) {
    function generateChartData(array) {
      let _value = [];
      // console.log(array, data[0])
      array.forEach((item) => {
        _value.push(data[0][mapLabels[item]]);
      });
      return {
        labels: array.map((item) => mapSelectLabels[mapLabels[item]]),
        datasets: [
          {
            data: _value,
            borderColor: array.map((item) =>
              !patientTotals.includes(item) ? "#800000" : "#00008B"
            ),
            backgroundColor: array.map((item) =>
              !patientTotals.includes(item) ? "#800000" : "#00008B"
            ),
            barThickness: 20, // Set a specific thickness for the bar
            maxBarThickness: 20,
          },
        ],
      };
    }

    setValue({
      mapValue1: generateChartData(mapBarCharts.chart1),
      mapValue2: generateChartData(mapBarCharts.chart2),
      mapValue3: generateChartData(mapBarCharts.chart3),
      mapValue4: generateChartData(mapBarCharts.chart4),
      mapValue5: generateChartData(mapBarCharts.chart5),
      ...data,
    });
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {TreeData && !loading ? (
        <>
          <div className="flex mb-6 items-center gap-8">
            <CustomDropdown
              showColors
              labelClassName="mb-0"
              className={"flex items-center"}
              input={{
                label: "Select Unmet Needs",
                id: "unmet",
                options: filters.map((item) => ({
                  name: selectLabels[item],
                  value: item,
                })),
              }}
              handleSelect={(e) => handleToggleFilter(e)}
              value={toggleFilter}
            />
          </div>

          <TreeMap
            values={values}
            preventDrill={true}
            data={TreeData}
            options={
              toggleFilter == filters[0] ? { ...options1 } : { ...options2 }
            }
            handleOpen={handleOpen}
          />
          <Popup
            onClose={closeModal}
            modal
            open={showModal}
            position="center center"
          >
            {modalDetails && (
              <BarChartPopup closeModal={closeModal} payerData data1={data1} />
            )}
          </Popup>
          <PayerVariationBubbleChart />
        </>
      ) : (
        <div role="status" className="grid place-content-center h-[200px]">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
      )}
    </div>
  );
};

export default PayerVariation;
