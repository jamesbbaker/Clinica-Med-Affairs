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

const filters = [...Object.keys(selectLabels)];

const PayerVariation = () => {
  const [TreeData, setTreeData] = useState(null);

  const [rawData, setRawData] = useState(null);
  const [toggleFilter, setToggleFilter] = useState(filters[0]);
  const [values, setValues] = useState({
    min: 0,
    max: 0
  })
  const [treeDataById, setTreeDataById] = useState({});
  const [data1, setData1] = useState(null)
  const [showModal, setShowModal] = useState(false);
  const [loading , setLoading] = useState(false)
  const [modalDetails, setModalDetails] = useState({});
  const [sizeValueMap, setSizeValueMap] = useState({});
  const options1 = {
    enableHighlight: true,
    minColor: "#00FF00",
    maxDepth: 0,
    maxPostDepth: 0,
    midColor: "#FFA500",
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
    
      let hcpValue = TreeData[_row + 1]

      return `<div style="background:rgb(0 141 218);display: flex; align-items:center; flex-direction:column; color:#fff; padding:10px; border-style:solid, zIndex: 10"> 
    <div><strong>NAME</strong>:  ${hcpValue[0]}</div>
    <div><strong>Number of ICS-LABA Patients</strong>:  ${hcpValue[2]}</div>
    <div><strong>${selectLabels[toggleFilter]}</strong>:  ${hcpValue[3]}</div>
     </div>`;
    },
  };
  const options2 = {
    minColor: "#00FF00",
    midColor: "#FFA500",
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
    
      let hcpValue = TreeData[_row + 1]

      return `<div style="background:rgb(0 141 218);display: flex; align-items:center; flex-direction:column; color:#fff; padding:10px; border-style:solid, zIndex: 10"> 
    <div><strong>NAME</strong>:  ${hcpValue[0]}</div>
    <div><strong>Number of ICS-LABA Patients</strong>:  ${hcpValue[2]}</div>
    <div><strong>${selectLabels[toggleFilter]}</strong>:  ${hcpValue[3]}</div>
     </div>`;
    },
  };
  const [selectedValues, setSelectedValues] = useState(
    EPL_TABLE_COLUMNS.map((col) => col.accessor)
  );
  const { accessToken, refreshToken } = useContext(AuthContext);

  const handleTreeData = (data, toggleFilter, page) => {
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
          item.Parent && item.Parent.toLowerCase() == "global" ? "PAYER" : item.Parent,
          item["Number of ICS-LABA Patients"],
          item[toggleFilter],
        ];
        treemapData.push(newArr);
      });
      setTreeDataById(newObj);
    
      setTreeData(treemapData);
    }
  }

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
    setLoading(true) 
    setTimeout(() => {
        setLoading(false)
    }, 500);
    setShowModal(false);
  };

  const fetchData = (
    
  ) => {

    let queryString = `payer_level_data?`; // Start with 'hcp_data?&'

    getDataStats(queryString, accessToken, refreshToken)
      .then((res) => {
        if (res) {
          let _data = JSON.parse(res.replaceAll("NaN", 0));
          setRawData(_data.data)
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
           let lowestValue =  getLowestValue(data, toggleFilter )
           let _highestValue =  highestValue(data, toggleFilter )
           setValues({
            min: lowestValue,
            max: _highestValue
           })

            data.map((item, index) => {
              newObj[item.Item] = item;
              let newArr = [
                item.Item,
                item.Parent &&  item.Parent.toLowerCase() == "global" ? "PAYER" : item.Parent,
                item["Number of ICS-LABA Patients"],
                item[toggleFilter],
              ];
              treemapData.push(newArr);
            });
            setTreeDataById(newObj);
          
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
      ...data
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
                  options: filters.map((item) => ({ name: selectLabels[item], value: item })),
                }}
                handleSelect={(e) => handleToggleFilter(e)}
                value={toggleFilter}
              />
            </div>

          <TreeMap
          values={values}
          preventDrill={true}
            data={TreeData}
            options={toggleFilter == filters[0] ? options1 : options2}
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

export default PayerVariation;
