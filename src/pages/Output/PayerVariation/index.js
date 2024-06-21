import React, { useContext, useEffect, useMemo, useState } from "react";
import TreeMap from "../../../components/TreeMap";
import {
  EPL_TABLE_COLUMNS,
  selectLabels,
} from "../../../constants/appConstants";
import { removeOrAddColumn } from "../../../utils/MapUtils";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import { MultiSelect } from "react-multi-select-component";
import Popup from "reactjs-popup";
import CustomDropdown from "../../../components/CustomDropdown";

const filters = [...Object.keys(selectLabels)];

const PayerVariation = () => {
  const [TreeData, setTreeData] = useState(null);
  const [specialityOptions, setSpecialityOptions] = useState(null);
  const [selectedSpeciality, setSelectedSpeciality] = useState(null);
  const [regionOptions, setRegionOptions] = useState(null);
  const [region, setRegion] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [toggleFilter, setToggleFilter] = useState(filters[0]);
  const [showModal, setShowModal] = useState(false);
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
    showScale: false,
    generateTooltip: (_row, _size, value) => {
      let hcpValue = sizeValueMap[
        TreeData[_row + 1][2] + "_" + TreeData[_row + 1][3]
      ] || {
        "First Name": "",
        "Last Name": "",
        "Number of ICS-LABA Patients": 0,
        toggleFilter: 0,
      };

      return `<div style="background:rgb(0 141 218);display: flex; align-items:center; flex-direction:column; color:#fff; padding:10px; border-style:solid, zIndex: 10"> 
    <div><strong>NAME</strong>:  ${hcpValue["Assigned Physician Name"]}</div>
    <div><strong>Number of ICS-LABA Patients</strong>:  ${hcpValue["Number of ICS-LABA Patients"]}</div>
    <div><strong>${selectLabels[toggleFilter]}</strong>:  ${hcpValue[toggleFilter]}</div>
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
      let hcpValue = sizeValueMap[
        TreeData[_row + 1][2] + "_" + TreeData[_row + 1][3]
      ] || {
        "First Name": "",
        "Last Name": "",
        "Number of ICS-LABA Patients": 0,
        toggleFilter: 0,
      };
      return `<div style="background:rgb(0 141 218);display: flex; align-items:center; flex-direction:column; color:#fff; padding:10px; border-style:solid, zIndex: 10"> 
    <div><strong>NAME</strong>:  ${hcpValue["Assigned Physician Name"]}</div>
    <div><strong>Number of ICS-LABA Patients</strong>:  ${hcpValue["Number of ICS-LABA Patients"]}</div>
    <div><strong>${selectLabels[toggleFilter]}</strong>:  ${hcpValue[toggleFilter]}</div>
     </div>`;
    },
  };
  const [selectedValues, setSelectedValues] = useState(
    EPL_TABLE_COLUMNS.map((col) => col.accessor)
  );
  const { accessToken, refreshToken } = useContext(AuthContext);

  const handleTreeData = (data, toggleFilter, page) => {
    console.log(data)
    let _treeData = [
      [
        "Region",
        "Parent",
        "Number of ICS-LABA Patients (size)",
        "Number of Severe Exacerbations (color)",
      ],
      ["Global", null, 0, 0],
    ];
    console.log(data)

    Object.keys(data).forEach(item => {
       
        let newItem = []
        let collectiveSize = 0
        let collectiveFilter = 0
        // data[item].map(_payerItem => {
        //     console.log(_payerItem)
        //     newItem.push([data[_payerItem["Plan Name"]], _payerItem,_payerItem["Number of ICS-LABA Patients"], _payerItem[toggleFilter] ])
        //     collectiveSize+=_payerItem["Number of ICS-LABA Patients"]
        //     collectiveFilter+=_payerItem[toggleFilter] 
        // })
        _treeData.push([
            `${item}`,
            `Global`,
            item["Number of ICS-LABA Patients"],
            item[toggleFilter],
          ]);
    })
    console.log(_treeData)
    // setSizeValueMap(sizeValue);
    setTreeData(JSON.parse(JSON.stringify(_treeData)));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (row, value, data) => {
    if (row === modalDetails.name) {
      return;
    }

    setShowModal(true);
    let _data = sizeValueMap[value + "_" + data];
    setModalDetails(_data);
  };

  const handleToggleFilter = (e) => {
    setToggleFilter(e);
    handleTreeData(rawData, e);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const fetchData = (
    filterValues = {
      specialty: selectedSpeciality,
      region: region,
      // organisation: organisation,
      // stateName: stateName,
    }
  ) => {
    const specialties = filterValues.specialty;
    const _region = filterValues.region;
    let queryString = `payer_variation_data?`; // Start with 'hcp_data?&'

    if (specialties && specialties.length > 0) {
      queryString += specialties
        .map((specialty) => `Primary Specialty Description=${specialty.value}`)
        .join("&");
    }
    if (_region && _region.length > 0) {
      queryString += `&${_region
        .map((region) => `Region=${region.value}`)
        .join("&")}`;
    }
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

    getDataStats(queryString, accessToken, refreshToken)
      .then((res) => {
        if (res) {
          let _data = JSON.parse(res.replaceAll("NaN", 0));
          if (_data) {
            let payerData = {}
            _data.data.map(item => {
                if (payerData.hasOwnProperty(item["Payer Name"])) {
                    payerData[item["Payer Name"]].push(item)
                } else {
                    payerData[item["Payer Name"]] = [item]
                }
            })
            // setRawData(_data.data);
            // setSpecialityOptions(_data.specialty_list);
            // setRegionOptions(_data.region_list);
            handleTreeData(payerData, toggleFilter);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleApplyFilter = () => {
    fetchData();
  };

  const handleToggleSelect = (val, index) => {
    if (index == "region") {
      setRegion(val);
    } else {
      setSelectedSpeciality(val);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {TreeData ? (
        <>
          <div className="flex flex-col w-full justify-between items-start">
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
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="font-[600] text-[18px]">Filters:</div>
                {regionOptions && (
                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                      Region Select
                    </label>
                    <MultiSelect
                      labelledBy=""
                      options={regionOptions.map((item) => ({
                        label: item,
                        value: item,
                      }))}
                      className="w-[10rem] z-[5]"
                      value={region || []}
                      onChange={(val) => handleToggleSelect(val, "region")}
                    />
                  </div>
                )}
                {specialityOptions && (
                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                      Primary Select
                    </label>
                    <MultiSelect
                      labelledBy=""
                      options={specialityOptions.map((item) => ({
                        label: item,
                        value: item,
                      }))}
                      className="w-[20rem] z-[5]"
                      value={selectedSpeciality || []}
                      onChange={(val) => handleToggleSelect(val, "primary")}
                    />
                  </div>
                )}
              </div>
              <button
                onClick={handleApplyFilter}
                className="border border-[#000] px-4 py-2 rounded-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
          <TreeMap
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
              <div className="flex px-4 py-8 flex-col items-start gap-4">
                <div>
                  <strong className="mr-2">Name:</strong>{" "}
                  {modalDetails["Assigned Physician Name"]}
                </div>
                <div>
                  <strong className="mr-2">Number of ICS-LABA Patients:</strong>{" "}
                  {modalDetails["Number of ICS-LABA Patients"]}
                </div>
                <div>
                  <strong className="mr-2">{toggleFilter}:</strong>{" "}
                  {modalDetails[toggleFilter]}
                </div>
              </div>
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