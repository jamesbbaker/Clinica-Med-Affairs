import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import Table from "../../../components/Table";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";
import {
  mapBarCharts,
  mapLabels,
  mapSelectLabels,
  patientTotals,
  selectLabels,
} from "../../../constants/appConstants";
import BarChartPopup from "../PatientOpportunityMapping/Popup";

const action_types = {
  handleFilterChange: "handleFilterChange",
  handleResetFilterValues: "handleResetFilterValues",
};

let obj = {};

Object.keys(selectLabels).forEach((item) => {
  return (obj[item] = { id: item, max: 0, min: 0 });
});

const initialState = { ...obj };

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case action_types.handleFilterChange:
      return {
        ...state,
        [payload.id]: {
          id: payload.id,
          min: payload.min,
          max: payload.max,
        },
      };
    case action_types.handleResetFilterValues:
      let arrayVal = payload.val;
      let _prevState = { ...state };
      let _filters = {};
      arrayVal.forEach((item) => {
        _filters[item.value] = {
          id: _prevState[item.value].id,
          min: _prevState[item.value].min,
          max: _prevState[item.value].max,
        };
      });
      return {
        ...initialState,
        ..._filters,
      };
    default:
      return state;
  }
};

const EligiblePatientLocator = () => {
  const [filterList, setFilterList] = useState([]);
  const [statsData1, setStatsData1] = useState(null);
  const [filterState, dispatch] = useReducer(reducer, initialState);
  const { accessToken, refreshToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSize, setcurrentSize] = useState(10);
  const [speciality, setSpeciality] = useState(null);
  const [region, setRegion] = useState(null);
  const [stateName, setstateName] = useState(null);
  const [organisation, setorganisation] = useState(null);
  const [totalPage, settotalPage] = useState(1);
  const [sortBy, setSortBy] = useState("Number of ICS-LABA Patients");
  const [sortOrder, setsortOrder] = useState("desc");
  const [value, setValue] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [specialityList, setSpecialityList] = useState(null);
  const [regionList, setRegionList] = useState(null);
  const [stateNameList, setstateNameList] = useState(null);
  const [organisationList, setorganisationList] = useState(null);
  const [icsNumber, setIcsNumber] = useState({ min: 0, max: 0 });
  const [steroidPercent, setsteroidPercent] = useState({ min: 0, max: 0 });
  const [data1, setData1] = useState(null);

  useEffect(() => {
    if (statsData1 === null) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [statsData1]);

  const fetchData = (
    page = 1,
    size = 5,
    _sortBy,
    _sortOrder,
    _speciality,
    _region,
    _stateName,
    _organisation
  ) => {
    setStatsData1(null);
    const specialties = _speciality;
    let queryString = `hcp_data?&`; // Start with 'hcp_data?&'

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
    if (_organisation && _organisation.length > 0) {
      queryString += `&${_organisation
        .map((organisation) => `Organization Name=${organisation.value}`)
        .join("&")}`;
    }
    if (_stateName && _stateName.length > 0) {
      queryString += `&${_stateName
        .map((statename) => `State Name=${statename.value}`)
        .join("&")}`;
    }

    // Add other query parameters as needed
    const additionalParams = {
      min_Number_of_Asthma_Patients:
        filterState["Number of Asthma Patients"].min,
      max_Number_of_Asthma_Patients:
        filterState["Number of Asthma Patients"]?.max !== undefined &&
        filterState["Number of Asthma Patients"].max !== 0
          ? filterState["Number of Asthma Patients"].max
          : undefined,
      min_Number_of_ICS_Patients: filterState["Number of ICS Patients"].min,
      max_Number_of_ICS_Patients:
        filterState["Number of ICS Patients"]?.max !== undefined &&
        filterState["Number of ICS Patients"].max !== 0
          ? filterState["Number of ICS Patients"].max
          : undefined,
      min_Number_of_ICS_LABA_Patients:
        filterState["Number of ICS-LABA Patients"].min,
      max_Number_of_ICS_LABA_Patients:
        filterState["Number of ICS-LABA Patients"]?.max !== undefined &&
        filterState["Number of ICS-LABA Patients"].max !== 0
          ? filterState["Number of ICS-LABA Patients"].max
          : undefined,
      min_Number_of_ICS_LABA_LAMA_Patients:
        filterState["Number of ICS-LABA LAMA Patients"].min,
      max_Number_of_ICS_LABA_LAMA_Patients:
        filterState["Number of ICS-LABA LAMA Patients"]?.max !== undefined &&
        filterState["Number of ICS-LABA LAMA Patients"].max !== 0
          ? filterState["Number of ICS-LABA LAMA Patients"].max
          : undefined,
      min_Number_of_No_Spirometry: filterState["Number of No Spirometry"].min,
      max_Number_of_No_Spirometry:
        filterState["Number of No Spirometry"]?.max !== undefined &&
        filterState["Number of No Spirometry"].max !== 0
          ? filterState["Number of No Spirometry"].max
          : undefined,
      min_Percent_of_No_Spirometry: filterState["Percent of No Spirometry"].min,
      max_Percent_of_No_Spirometry:
        filterState["Percent of No Spirometry"]?.max !== undefined &&
        filterState["Percent of No Spirometry"].max !== 0
          ? filterState["Percent of No Spirometry"].max
          : undefined,
      min_Number_of_No_EOS_Testing: filterState["Number of No EOS Testing"].min,
      max_Number_of_No_EOS_Testing:
        filterState["Number of No EOS Testing"]?.max !== undefined &&
        filterState["Number of No EOS Testing"].max !== 0
          ? filterState["Number of No EOS Testing"].max
          : undefined,
      min_Percent_of_No_EOS_Testing:
        filterState["Percent of No EOS Testing"].min,
      max_Percent_of_No_EOS_Testing:
        filterState["Percent of No EOS Testing"]?.max !== undefined &&
        filterState["Percent of No EOS Testing"].max !== 0
          ? filterState["Percent of No EOS Testing"].max
          : undefined,
      min_Number_of_No_Treatment: filterState["Number of No Treatment"].min,
      max_Number_of_No_Treatment:
        filterState["Number of No Treatment"]?.max !== undefined &&
        filterState["Number of No Treatment"].max !== 0
          ? filterState["Number of No Treatment"].max
          : undefined,
      min_Percent_of_No_Treatment: filterState["Percent of No Treatment"].min,
      max_Percent_of_No_Treatment:
        filterState["Percent of No Treatment"]?.max !== undefined &&
        filterState["Percent of No Treatment"].max !== 0
          ? filterState["Percent of No Treatment"].max
          : undefined,
      min_Number_of_ICS_High_Steroid_Usage:
        filterState["Number of ICS High Steroid Usage"].min,
      max_Number_of_ICS_High_Steroid_Usage:
        filterState["Number of ICS High Steroid Usage"]?.max !== undefined &&
        filterState["Number of ICS High Steroid Usage"].max !== 0
          ? filterState["Number of ICS High Steroid Usage"].max
          : undefined,
      min_Percent_of_ICS_High_Steroid_Usage:
        filterState["Percent of ICS High Steroid Usage"].min,
      max_Percent_of_ICS_High_Steroid_Usage:
        filterState["Percent of ICS High Steroid Usage"]?.max !== undefined &&
        filterState["Percent of ICS High Steroid Usage"].max !== 0
          ? filterState["Percent of ICS High Steroid Usage"].max
          : undefined,
      min_Number_of_ICS_Exacerbation_Failed_Escalation:
        filterState["Number of ICS Exacerbation Failed Escalation"].min,
      max_Number_of_ICS_Exacerbation_Failed_Escalation:
        filterState["Number of ICS Exacerbation Failed Escalation"]?.max !==
          undefined &&
        filterState["Number of ICS Exacerbation Failed Escalation"].max !== 0
          ? filterState["Number of ICS Exacerbation Failed Escalation"].max
          : undefined,
      min_Percent_of_ICS_Exacerbation_Failed_Escalation:
        filterState["Percent of ICS Exacerbation Failed Escalation"].min,
      max_Percent_of_ICS_Exacerbation_Failed_Escalation:
        filterState["Percent of ICS Exacerbation Failed Escalation"]?.max !==
          undefined &&
        filterState["Percent of ICS Exacerbation Failed Escalation"].max !== 0
          ? filterState["Percent of ICS Exacerbation Failed Escalation"].max
          : undefined,
      min_Number_of_ICS_LABA_Escalation_Delay:
        filterState["Number of ICS-LABA Escalation Delay"].min,
      max_Number_of_ICS_LABA_Escalation_Delay:
        filterState["Number of ICS-LABA Escalation Delay"]?.max !== undefined &&
        filterState["Number of ICS-LABA Escalation Delay"].max !== 0
          ? filterState["Number of ICS-LABA Escalation Delay"].max
          : undefined,
      min_Percent_of_ICS_LABA_Escalation_Delay:
        filterState["Percent of ICS-LABA Escalation Delay"].min,
      max_Percent_of_ICS_LABA_Escalation_Delay:
        filterState["Percent of ICS-LABA Escalation Delay"]?.max !==
          undefined &&
        filterState["Percent of ICS-LABA Escalation Delay"].max !== 0
          ? filterState["Percent of ICS-LABA Escalation Delay"].max
          : undefined,
      min_Number_of_ICS_LABA_Patients_with_LAMA:
        filterState["Number of ICS-LABA Patients with LAMA"].min,
      max_Number_of_ICS_LABA_Patients_with_LAMA:
        filterState["Number of ICS-LABA Patients with LAMA"]?.max !==
          undefined &&
        filterState["Number of ICS-LABA Patients with LAMA"].max !== 0
          ? filterState["Number of ICS-LABA Patients with LAMA"].max
          : undefined,
      min_Percent_of_ICS_LABA_Patients_with_LAMA:
        filterState["Percent of ICS-LABA Patients with LAMA"].min,
      max_Percent_of_ICS_LABA_Patients_with_LAMA:
        filterState["Percent of ICS-LABA Patients with LAMA"]?.max !==
          undefined &&
        filterState["Percent of ICS-LABA Patients with LAMA"].max !== 0
          ? filterState["Percent of ICS-LABA Patients with LAMA"].max
          : undefined,
      min_Number_of_ICS_Persistence_less_than_360:
        filterState["Number of ICS Persistence < 360"].min,
      max_Number_of_ICS_Persistence_less_than_360:
        filterState["Number of ICS Persistence < 360"]?.max !== undefined &&
        filterState["Number of ICS Persistence < 360"].max !== 0
          ? filterState["Number of ICS Persistence < 360"].max
          : undefined,
      min_Percent_of_ICS_Persistence_less_than_360:
        filterState["Percent of ICS Persistence < 360"].min,
      max_Percent_of_ICS_Persistence_less_than_360:
        filterState["Percent of ICS Persistence < 360"]?.max !== undefined &&
        filterState["Percent of ICS Persistence < 360"].max !== 0
          ? filterState["Percent of ICS Persistence < 360"].max
          : undefined,
      min_Number_of_ICS_Compliance_less_than_240:
        filterState["Number of ICS Compliance < 240"].min,
      max_Number_of_ICS_Compliance_less_than_240:
        filterState["Number of ICS Compliance < 240"]?.max !== undefined &&
        filterState["Number of ICS Compliance < 240"].max !== 0
          ? filterState["Number of ICS Compliance < 240"].max
          : undefined,
      min_Percent_of_ICS_Compliance_less_than_240:
        filterState["Percent of ICS Compliance < 240"].min,
      max_Percent_of_ICS_Compliance_less_than_240:
        filterState["Percent of ICS Compliance < 240"]?.max !== undefined &&
        filterState["Percent of ICS Compliance < 240"].max !== 0
          ? filterState["Percent of ICS Compliance < 240"].max
          : undefined,
      min_Number_of_ICS_LABA_Persistence_less_than_360:
        filterState["Number of ICS-LABA Persistence < 360"].min,
      max_Number_of_ICS_LABA_Persistence_less_than_360:
        filterState["Number of ICS-LABA Persistence < 360"]?.max !==
          undefined &&
        filterState["Number of ICS-LABA Persistence < 360"].max !== 0
          ? filterState["Number of ICS-LABA Persistence < 360"].max
          : undefined,
      min_Percent_of_ICS_LABA_Persistence_less_than_360:
        filterState["Percent of ICS-LABA Persistence < 360"].min,
      max_Percent_of_ICS_LABA_Persistence_less_than_360:
        filterState["Percent of ICS-LABA Persistence < 360"]?.max !==
          undefined &&
        filterState["Percent of ICS-LABA Persistence < 360"].max !== 0
          ? filterState["Percent of ICS-LABA Persistence < 360"].max
          : undefined,
      min_Number_of_ICS_LABA_Compliance_less_than_240:
        filterState["Number of ICS-LABA Compliance < 240"].min,
      max_Number_of_ICS_LABA_Compliance_less_than_240:
        filterState["Number of ICS-LABA Compliance < 240"]?.max !== undefined &&
        filterState["Number of ICS-LABA Compliance < 240"].max !== 0
          ? filterState["Number of ICS-LABA Compliance < 240"].max
          : undefined,
      min_Percent_of_ICS_LABA_Compliance_less_than_240:
        filterState["Percent of ICS-LABA Compliance < 240"].min,
      max_Percent_of_ICS_LABA_Compliance_less_than_240:
        filterState["Percent of ICS-LABA Compliance < 240"]?.max !==
          undefined &&
        filterState["Percent of ICS-LABA Compliance < 240"].max !== 0
          ? filterState["Percent of ICS-LABA Compliance < 240"].max
          : undefined,
      min_Number_of_ICS_LABA_LAMA_Persistence_less_than_360:
        filterState["Number of ICS-LABA LAMA Persistence < 360"].min,
      max_Number_of_ICS_LABA_LAMA_Persistence_less_than_360:
        filterState["Number of ICS-LABA LAMA Persistence < 360"]?.max !==
          undefined &&
        filterState["Number of ICS-LABA LAMA Persistence < 360"].max !== 0
          ? filterState["Number of ICS-LABA LAMA Persistence < 360"].max
          : undefined,
      min_Percent_of_ICS_LABA_LAMA_Persistence_less_than_360:
        filterState["Percent of ICS-LABA LAMA Persistence < 360"].min,
      max_Percent_of_ICS_LABA_LAMA_Persistence_less_than_360:
        filterState["Percent of ICS-LABA LAMA Persistence < 360"]?.max !==
          undefined &&
        filterState["Percent of ICS-LABA LAMA Persistence < 360"].max !== 0
          ? filterState["Percent of ICS-LABA LAMA Persistence < 360"].max
          : undefined,
      sort_by: _sortBy,
      sort_order: _sortOrder,
      page,
      page_size: size,
    };

    // Concatenate additional parameters (filter out undefined values)
    const urlParams = Object.entries(additionalParams)
      .filter(
        ([key, value]) => value !== undefined && value !== "" && value !== null
      )
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    // Combine the base URL, dynamic specialties, and additional parameters
    const finalUrl = `${queryString}${
      urlParams.length > 0 ? "&" : ""
    }${urlParams}`;

    getDataStats(finalUrl, accessToken, refreshToken)
      .then((res) => {
        let _data = JSON.parse(res.replaceAll("NaN", 0));

        if (_data) {
          settotalPage(Math.floor(_data.total / currentSize));
          const responseData = _data.data;
          setSpecialityList(_data.specialty_list);
          setRegionList(_data.region_list);
          setorganisationList(_data.organization_list);
          setstateNameList(_data.state_name_list);
          const newData = responseData.map((item) => {
            return {
              ...item,
              Name: item["First Name"] + " " + item["Last Name"],
            };
          });

          setStatsData1(newData);
        }
      })
      .catch((err) => {
        console.log(err, "err");
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

  const handleRowClicked = (col) => {
   
    setChartDataValue(setData1, null, [col.original]);
  };

  useEffect(() => {
    fetchData(
      currentPage,
      currentSize,
      sortBy,
      sortOrder,
      speciality,
      region,
      stateName,
      organisation
    );
  }, [currentPage, currentSize]);

  const Table_Columns_1 = useMemo(() => {
    const column_names = [
      {
        header: "Assigned Physician Name",
        accessor: "Assigned Physician Name",
      },
      // { header: "Last Name", accessor: "Last Name" },
      {
        header: "Assigned Specialty",
        accessor: "Assigned Specialty",
      },
      { header: "Region", accessor: "Region" },
      { header: "State Name", accessor: "State Name" },
      { header: "City", accessor: "City" },
      { header: "Organization Name", accessor: "Organization Name" },
      // { header: "Provider ID", accessor: "Provider ID" },
      // { header: "ZIP", accessor: "ZIP" },
      // { header: "LAT", accessor: "LAT" },
      // { header: "LONG", accessor: "LONG" },
      // { header: "State ID", accessor: "State ID" },

      // {
      //   header: "Number of ICS-LABA Patients",
      //   accessor: "Number of ICS-LABA Patients",
      // },
      // {
      //   header: "Number of High Steroid Usage Patients",
      //   accessor: "Number of High Steroid Usage Patients",
      // },
      // {
      //   header: "Number of Severe Exacerbations",
      //   accessor: "Number of Severe Exacerbations",
      // },
      // {
      //   header: "Percent of High Steroid Usage Patients",
      //   accessor: "Percent of High Steroid Usage Patients",
      // },
      // {
      //   header: "Percent of Severe Exacerbations",
      //   accessor: "Percent of Severe Exacerbations",
      // },
    ];
    [...Object.keys(selectLabels)].map((item) =>
      column_names.push({
        header: item,
        accessor: item,
      })
    );

    const USERS_TABLE_COLUMNS = column_names.map((column) => ({
      Header: column.header,
      accessor: column.accessor,
    }));

    return USERS_TABLE_COLUMNS;
  }, []);

  const handleFilter = (speciality, region, stateName, organisation) => {
    fetchData(
      currentPage,
      currentSize,
      sortBy,
      sortOrder,
      speciality,
      region,
      stateName,
      organisation
    );
  };

  const closeModal = () => {
    setData1(null)

  };

  const handleSort = (column) => {
    let _sortOrder = "desc";
    let columnId = column.id === "Name" ? "First Name" : column.id;
    if (sortBy === columnId) {
      setsortOrder((prev) => {
        if (prev === "desc") {
          _sortOrder = "asc";
          return "asc";
        } else {
          _sortOrder = "desc";
          return "desc";
        }
      });
    }
    setSortBy(columnId);
    fetchData(
      currentPage,
      currentSize,
      columnId,
      _sortOrder,
      speciality,
      region,
      stateName,
      organisation
    );
  };

 

  return statsData1 !== null && !loading ? (
    <>
      {data1 ? (
        <BarChartPopup closeModal={closeModal} data1={data1} />
      ) : (
        <Table
          isEligible={true}
          dispatch={dispatch}
          setFilterList={setFilterList}
          filterList={filterList}
          filterState={filterState}
          value={value}
          setValue={setValue}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          handleRowClicked={handleRowClicked}
          showTopBtnsToggle={true}
          setcurrentSize={setcurrentSize}
          speciality={speciality}
          setSpeciality={setSpeciality}
          specialityList={specialityList}
          stateName={stateName}
          setStateName={setstateName}
          stateNameList={stateNameList}
          organisationList={organisationList}
          organisation={organisation}
          setorganisation={setorganisation}
          regionList={regionList}
          region={region}
          setRegion={setRegion}
          icsNumber={icsNumber}
          setIcsNumber={setIcsNumber}
          steroidPercent={steroidPercent}
          setsteroidPercent={setsteroidPercent}
          handleFilter={handleFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          handleSort={handleSort}
          totalPage={totalPage}
          currentSize={currentSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          marginTop="2rem"
          Title="Summary of Unmet Need by HCP"
          activeCells={true}
          initialState={{
            pageSize: 10,
            pageIndex: 0,
          }}
          selectionBtnsArray={[...Object.keys(selectLabels)]}
          showSelectionBtns={true}
          TableData={statsData1}
          TableColummns={Table_Columns_1}
        />
      )}
    </>
  ) : (
    <div role="status" className="grid w-full place-content-center h-[200px]">
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
  );
};

export default EligiblePatientLocator;
