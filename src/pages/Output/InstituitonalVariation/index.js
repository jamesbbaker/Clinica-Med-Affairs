import React, { useContext, useEffect, useMemo, useState } from "react";
import SelectionButtons from "../../../components/SelectionButtons";
import TreeMap from "../../../components/TreeMap";
import { EPL_TABLE_COLUMNS } from "../../../constants/appConstants";
import { removeOrAddColumn } from "../../../utils/MapUtils";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import { MultiSelect } from "react-multi-select-component";
import Popup from "reactjs-popup";
import SelectBox from "../../../components/SelectBox";

const data = [
  [
    "Location",
    "Parent",
    "Market trade volume (size)",
    "Market increase/decrease (color)",
  ],
  ["Global", null, 0, 0],
  ["1", "Global", 0, 0],
  ["2", "Global", 0, 0],
  ["3", "Global", 0, 0],
  ["4", "Global", 0, 0],
  ["5", "Global", 0, 0],
  ["6", "Global", 0, 0],
  ["7", "Global", 0, 0],
  ["8", "Global", 0, 0],
  ["9", "Global", 0, 0],
  ["cvRisk_1", "1", 48, -7],
  ["calciumBlocker_1", "1", 51, -1],
  ["monitoring_1", "1", 49, 23],
  ["offLabelTreatment_1", "1", 49, -39],
  ["nonAdherenceAnticoagulants_1", "1", 48, -31],
  ["incompleteTesting_1", "1", 50, -4],
  ["repeatedCardioversions_1", "1", 51, 12],
  ["supportTherapy_1", "1", 49, -13],
  ["manageAEs_1", "1", 53, 31],
  ["nonAdherenceAFDrugs_1", "1", 51, 5],
  ["failureFollowUp_1", "1", 52, 18],
  ["cvRisk_2", "2", 50, -36],
  ["calciumBlocker_2", "2", 54, -23],
  ["monitoring_2", "2", 51, -30],
  ["offLabelTreatment_2", "2", 48, 8],
  ["nonAdherenceAnticoagulants_2", "2", 52, -20],
  ["incompleteTesting_2", "2", 45, -11],
  ["repeatedCardioversions_2", "2", 47, 46],
  ["supportTherapy_2", "2", 50, 33],
  ["manageAEs_2", "2", 49, 40],
  ["nonAdherenceAFDrugs_2", "2", 52, -19],
  ["failureFollowUp_2", "2", 52, -14],
  ["cvRisk_3", "3", 55, 24],
  ["calciumBlocker_3", "3", 57, -43],
  ["monitoring_3", "3", 49, 2],
  ["offLabelTreatment_3", "3", 55, -17],
  ["nonAdherenceAnticoagulants_3", "3", 49, 25],
  ["incompleteTesting_3", "3", 53, -26],
  ["repeatedCardioversions_3", "3", 54, 48],
  ["supportTherapy_3", "3", 51, 18],
  ["manageAEs_3", "3", 54, -6],
  ["nonAdherenceAFDrugs_3", "3", 56, -29],
  ["failureFollowUp_3", "3", 58, 36],
  ["cvRisk_4", "4", 54, -5],
  ["calciumBlocker_4", "4", 51, -49],
  ["monitoring_4", "4", 50, 27],
  ["offLabelTreatment_4", "4", 53, -45],
  ["nonAdherenceAnticoagulants_4", "4", 53, 31],
  ["incompleteTesting_4", "4", 54, -41],
  ["repeatedCardioversions_4", "4", 54, -21],
  ["supportTherapy_4", "4", 51, -24],
  ["manageAEs_4", "4", 50, -25],
  ["nonAdherenceAFDrugs_4", "4", 52, 10],
  ["failureFollowUp_4", "4", 53, 2],
  ["cvRisk_5", "5", 47, -3],
  ["calciumBlocker_5", "5", 42, 10],
  ["monitoring_5", "5", 44, -14],
  ["offLabelTreatment_5", "5", 41, 7],
  ["nonAdherenceAnticoagulants_5", "5", 45, 3],
  ["incompleteTesting_5", "5", 46, -45],
  ["repeatedCardioversions_5", "5", 45, 17],
  ["supportTherapy_5", "5", 47, -8],
  ["manageAEs_5", "5", 40, 14],
  ["nonAdherenceAFDrugs_5", "5", 42, 38],
  ["failureFollowUp_5", "5", 45, -38],
  ["cvRisk_6", "6", 52, 31],
  ["calciumBlocker_6", "6", 49, 17],
  ["monitoring_6", "6", 47, 48],
  ["offLabelTreatment_6", "6", 47, -25],
  ["nonAdherenceAnticoagulants_6", "6", 51, -34],
  ["incompleteTesting_6", "6", 49, 33],
  ["repeatedCardioversions_6", "6", 47, 0],
  ["supportTherapy_6", "6", 48, 40],
  ["manageAEs_6", "6", 48, -5],
  ["nonAdherenceAFDrugs_6", "6", 50, -9],
  ["failureFollowUp_6", "6", 50, 9],
  ["cvRisk_7", "7", 57, 2],
  ["calciumBlocker_7", "7", 52, -34],
  ["monitoring_7", "7", 58, -23],
  ["offLabelTreatment_7", "7", 57, -6],
  ["nonAdherenceAnticoagulants_7", "7", 58, 37],
  ["incompleteTesting_7", "7", 55, 41],
  ["repeatedCardioversions_7", "7", 58, 45],
  ["supportTherapy_7", "7", 56, -25],
  ["manageAEs_7", "7", 60, 18],
  ["nonAdherenceAFDrugs_7", "7", 61, -15],
  ["failureFollowUp_7", "7", 61, -39],
  ["cvRisk_8", "8", 53, 23],
  ["calciumBlocker_8", "8", 47, -26],
  ["monitoring_8", "8", 52, -31],
  ["offLabelTreatment_8", "8", 52, 28],
  ["nonAdherenceAnticoagulants_8", "8", 52, 22],
  ["incompleteTesting_8", "8", 47, -18],
  ["repeatedCardioversions_8", "8", 47, 26],
  ["supportTherapy_8", "8", 52, -20],
  ["manageAEs_8", "8", 48, -47],
  ["nonAdherenceAFDrugs_8", "8", 55, -8],
  ["failureFollowUp_8", "8", 55, -3],
  ["cvRisk_9", "9", 55, -49],
  ["calciumBlocker_9", "9", 54, -15],
  ["monitoring_9", "9", 52, -30],
  ["offLabelTreatment_9", "9", 54, -21],
  ["nonAdherenceAnticoagulants_9", "9", 54, -25],
  ["incompleteTesting_9", "9", 54, -36],
  ["repeatedCardioversions_9", "9", 58, -36],
  ["supportTherapy_9", "9", 52, 49],
  ["manageAEs_9", "9", 58, -17],
  ["nonAdherenceAFDrugs_9", "9", 58, -27],
  ["failureFollowUp_9", "9", 58, -29],
];

const filters = [
  "Percent of High Steroid Usage Patients",
  "Percent of Severe Exacerbations",
];

const InstitutionalVariation = () => {
  const [TreeData, setTreeData] = useState(null);
  const [specialityOptions, setSpecialityOptions] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [selectedSpeciality, setSelectedSpeciality] = useState(null);
  const [toggleFilter, setToggleFilter] = useState(filters[0]);
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState({});
  const options1 = {
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

    showScale: false,
    generateTooltip: (_row, _size, value) => {
      // console.log(_row, _size, value);
      // console.log(TreeData[_row])
      let _value  =rawData.filter(item => item["Number of ICS-LABA Patients"] == _size).filter(item => item[toggleFilter] == value)[0]
      let hcpValue = _value || {
        "First Name": "",
        "Last Name": "",
        "Number of ICS-LABA Patients": 0,
        toggleFilter: 0,
      };
  

    return `<div style="background:rgb(0 141 218);display: flex; align-items:center; flex-direction:column; color:#fff; padding:10px; border-style:solid, zIndex: 10"> 
    <div><strong>NAME</strong>:  ${hcpValue["Assigned Physician Name"]}</div>
    <div><strong>Number of ICS-LABA Patients</strong>:  ${
      hcpValue["Number of ICS-LABA Patients"]
    }</div>
    <div>row: ${_row}</div>
    <div>_size: ${_size}</div>
   
    <div>value: ${value}</div>
    <div><strong>${filters[1]}</strong>:  ${hcpValue[filters[1]]}</div>
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
    //  rawData[_row - 1 - Math.floor(rawData.length/100)]
    showScale: false,
    generateTooltip: (_row, _size, value) => {
      console.log(_row, _size, value);
      let hcpValue = TreeData[_row] || {
        "First Name": "",
        "Last Name": "",
        "Number of ICS-LABA Patients": 0,
        toggleFilter: 0,
      };

      return `<div style="background:rgb(0 141 218);display: flex; align-items:center; flex-direction:column; color:#fff; padding:10px; border-style:solid, zIndex: 10"> 
    <div><strong>NAME</strong>:  ${hcpValue["Assigned Physician Name"]}</div>
    <div><strong>Number of ICS-LABA Patients</strong>:  ${
      hcpValue["Number of ICS-LABA Patients"]
    }</div>
    <div><strong>${filters[1]}</strong>:  ${hcpValue[filters[1]]}</div>
     </div>`;
    },
  };
  const [selectedValues, setSelectedValues] = useState(
    EPL_TABLE_COLUMNS.map((col) => col.accessor)
  );
  const { accessToken, refreshToken } = useContext(AuthContext);

  // const loadMoreData = () => {
  //   const nextPage = currentPage + 1;
  //   const start = nextPage * PAGE_SIZE + 1;
  //   const end = start + PAGE_SIZE;
  //   const newVisibleData = data.slice(0, end);
  //   setVisibleData(newVisibleData);
  //   setCurrentPage(nextPage);
  // };

  const handleTreeData = (data, toggleFilter, page) => {
    let _treeData = [
      [
        "Region",
        "Parent",
        "Number of ICS-LABA Patients (size)",
        "Number of Severe Exacerbations (color)",
      ],
      ["Global", null, 0, 0],
    ];

    // for (let i = 0; i <= Math.floor(data.length / 5); i++) {
    //   const groupId = `group${i + 1}`;
    //   const startIndex = i * 5;
    //   const endIndex = startIndex + 5;

    //   // Ensure we don't go out of bounds
    //   const groupData = data.slice(startIndex, endIndex);

    //   let first100Total = 0;
    //   let first100TotalValue = 0;
    //   if (groupData.length < 5) {
    //     first100Total = groupData.reduce(
    //       (total, record) => total + record["Number of ICS-LABA Patients"],
    //       0
    //     );
    //     first100TotalValue = groupData.reduce(
    //       (total, record) => total + record[toggleFilter],
    //       0
    //     );
    //   } else {
    //     first100Total = groupData
    //       .slice(0, 5)
    //       .reduce(
    //         (total, record) => total + record["Number of ICS-LABA Patients"],
    //         0
    //       );
    //     first100TotalValue = groupData.reduce(
    //       (total, record) => total + record[toggleFilter],
    //       0
    //     );
    //   }

    //   _treeData.push([groupId, "Global", first100Total, first100TotalValue]);
    // }

    // Print the results

    let groupId = 1;
    let groupInterval = 1;
    data.map((item, index) => {
      // if (groupInterval > 5) {
      //   groupId++;
      //   groupInterval = 1;
      // }
      // console.log(groupId)
      _treeData.push([
        `${item["Assigned Physician Name"] + index}`,
        `Global`,
        item["Number of ICS-LABA Patients"],
        item[toggleFilter],
      ]);
      // groupInterval++;
    });
    setTreeData(_treeData);
  };

  useEffect(() => {
    getDataStats("institutional_variation_data", accessToken, refreshToken)
      .then((res) => {
        if (res) {
          let _data = JSON.parse(res.replaceAll("NaN", 0));
          if (_data) {
            setRawData(_data.data);
            setSpecialityOptions(_data.specialty_list);
            handleTreeData(_data.data, toggleFilter);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleOpen = (row, value, data) => {
    if (row === modalDetails.name) {
      return;
    }
    setShowModal(true);
    setModalDetails({
      name: row,
    });
  };

  const handleToggleFilter = (item) => {
    setToggleFilter(item);
    handleTreeData(rawData, item);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const filterData = () => {
    const specialties = selectedSpeciality;
    let queryString = `hcp_data?&`; // Start with 'hcp_data?&'

    if (specialties && specialties.length > 0) {
      queryString += specialties
        .map((specialty) => `Primary Specialty Description=${specialty.value}`)
        .join("&");
    }
    // if (_region && _region.length > 0) {
    //   queryString += `&${_region
    //     .map((region) => `Region=${region.value}`)
    //     .join("&")}`;
    // }
    // if (_organisation && _organisation.length > 0) {
    //   queryString += `&${_organisation
    //     .map((organisation) => `Organization Name=${organisation.value}`)
    //     .join("&")}`;
    // }
    // if (_stateName && _stateName.length > 0) {
    //   queryString += `&${_stateName
    //     .map((statename) => `State Name=${statename.value}`)
    //     .join("&")}`;
    // }

    // Concatenate additional parameters (filter out undefined values)
    // const urlParams = Object.entries(additionalParams)
    //   .filter(
    //     ([key, value]) => value !== undefined && value !== "" && value !== null
    //   )
    //   .map(([key, value]) => `${key}=${value}`)
    //   .join("&");

    // Combine the base URL, dynamic specialties, and additional parameters
    const finalUrl = `${queryString}`;
    console.log(finalUrl);
  };

  const handleToggleSelect = (val) => {
    setSelectedSpeciality(val);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {TreeData ? (
        <>
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center mt-2 gap-8">
              <label className="font-[600]"></label>
              <SelectBox
                className={"flex items-center"}
                input={{
                  label: "Select Unmet Needs",
                  id: "unmet",
                  options: filters.map((item) => ({ name: item, value: item })),
                }}
                handleSelect={(e) => handleToggleFilter(e)}
                value={toggleFilter}
              />
            </div>
            <button className="border border-[#000] px-4 py-2 rounded-xs">
              Apply Filters
            </button>
          </div>
          {/* <div className="flex items-center gap-4 cursor-pointer">
            {filters.map((item) => (
              <div
                className="p-2"
                onClick={() => handleToggleFilter(item)}
                style={{
                  background: item == toggleFilter ? "#c4c4c4" : "transparent",
                }}
              >
                {item}
              </div>
            ))}
          </div> */}
          <TreeMap
            needCallbacks={false}
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
            <div className="flex p-10 flex-col items-center">
              <div>
                <strong>Name:</strong> {modalDetails.name}
              </div>
            </div>
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

export default InstitutionalVariation;
