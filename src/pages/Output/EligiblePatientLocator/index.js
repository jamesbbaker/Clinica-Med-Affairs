import React, { useContext, useEffect, useMemo, useState } from "react";
import Table from "../../../components/Table";
import { getDataStats } from "../../../API/Outputs";
import { AuthContext } from "../../../context/AuthContext";

const EligiblePatientLocator = () => {
  const [statsData1, setStatsData1] = useState(null);
  const [statsData2, setStatsData2] = useState(null);
  const { accessToken, refreshToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSize, setcurrentSize] = useState(10);
  const [speciality, setSpeciality] = useState(null);
  const [totalPage, settotalPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setsortOrder] = useState("asc");
  const [tableColumns, setTableColumns] = useState([{}]);
  const [specialityList, setSpecialityList] = useState(null);
  const [icsNumber, setIcsNumber] = useState({ min: 0, max: 0 });
  const [steroidPercent, setsteroidPercent] = useState({ min: 0, max: 0 });

  useEffect(() => {
    if (!statsData1) {
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
    ics_patients,
    steroid_percent,
    _speciality
  ) => {
    setStatsData1(null);
    const specialties = _speciality; // Assuming specialties come from request arguments

    let queryString = `hcp_data?`;

    // Dynamically add Primary Specialty Description parameters
    if (specialties && specialties.length > 0) {
      queryString += specialties
        .map((specialty) => `Primary Specialty Description=${specialty.value}`)
        .join("&");
    }

    // Add other query parameters as needed
    const additionalParams = {
      max_ics_laba_patients:
        ics_patients?.max && ics_patients.max !== 0
          ? ics_patients.max
          : undefined,
      min_ics_laba_patients: ics_patients?.min,
      max_percent_high_steroid:
        steroid_percent?.max && steroid_percent.max !== 0
          ? steroid_percent.max
          : undefined,
      min_percent_high_steroid: steroid_percent?.min,
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

    console.log(finalUrl);

    getDataStats(finalUrl, accessToken, refreshToken)
      .then((res) => {
        let _data = JSON.parse(res.replaceAll("NaN", 0));

        if (_data) {
          settotalPage(Math.floor(_data.total / currentSize));
          const responseData = _data.data;
          setSpecialityList(_data.specialty_list);

          setStatsData1(responseData);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  useEffect(() => {
    getDataStats("data_stats_23", accessToken, refreshToken)
      .then((responseData) => {
        if (responseData) {
          let _data = JSON.parse(responseData.replaceAll("NaN", 0));
          setStatsData2(_data.data);
          setTableColumns(
            _data.headers.map((item) => ({ Header: item, accessor: item }))
          );
        }
      })
      .catch((err) => console.log(err));
    fetchData(currentPage, currentSize);
  }, [currentPage, currentSize]);


  const Table_Columns_1 = useMemo(() => {
    const column_names = [
      { header: "First Name", accessor: "First Name" },
      { header: "Last Name", accessor: "Last Name" },
      {
        header: "Primary Specialty Description",
        accessor: "Primary Specialty Description",
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
      {
        header: "Number of ICS-LABA Patients",
        accessor: "Number of ICS-LABA Patients",
      },
      {
        header: "Number of High Steroid Usage Patients",
        accessor: "Number of High Steroid Usage Patients",
      },
      {
        header: "Number of Severe Exacerbations",
        accessor: "Number of Severe Exacerbations",
      },
      {
        header: "Percent of High Steroid Usage Patients",
        accessor: "Percent of High Steroid Usage Patients",
      },
      {
        header: "Percent of Severe Exacerbations",
        accessor: "Percent of Severe Exacerbations",
      },
    ];

    const USERS_TABLE_COLUMNS = column_names.map((column) => ({
      Header: column.header,
      accessor: column.accessor,
    }));

    return USERS_TABLE_COLUMNS;
  }, []);

  const handleFilter = (icsNumber, steroidPercent, speciality) => {
    fetchData(
      currentPage,
      currentSize,
      sortBy,
      sortOrder,
      icsNumber,
      steroidPercent,
      speciality
    );
  };

  const handleSort = (column) => {
    let _sortOrder = "asc";
    if (sortBy == column.id) {
      setsortOrder("desc");
      _sortOrder = "desc";
    }
    setSortBy(column.id);
    fetchData(currentPage, currentSize, column.id, _sortOrder);
  };

  return statsData1 && statsData2 && !loading ? (
    <>
      <Table
        initialState={{
          pageSize: 10,
          pageIndex: 0,
        }}
        Title="Summary of Unmet Need by Specialty"
        showSelectionBtns={false}
        TableData={statsData2}
        marginTop={0}
        TableColummns={tableColumns}
      />
      <Table
        speciality={speciality}
        setSpeciality={setSpeciality}
        specialityList={specialityList}
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
          pageSize: 5,
          pageIndex: 0,
        }}
        selectionBtnsArray={[
          "Number of ICS-LABA Patients",
          "Number of High Steroid Usage Patients",
          "Number of Severe Exacerbations",
          "Percent of High Steroid Usage Patients",
          "Percent of Severe Exacerbations",
        ]}
        showSelectionBtns={true}
        TableData={statsData1}
        TableColummns={Table_Columns_1}
      />
    </>
  ) : (
    <div role="status" className="grid place-content-center h-[200px]">
      <svg
        aria-hidden="true"
        class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
      <span class="sr-only">Loading...</span>
    </div>
  );
};

export default EligiblePatientLocator;
