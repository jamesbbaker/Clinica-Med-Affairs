import fakeData from "./table-data.json";
import * as React from "react";
import { useState } from "react";
import { useEffect, useContext } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import Popup from "reactjs-popup";
import BarChart from "../BarChart";
import {
  EPL_TABLE_COLUMNS,
  invertedMapLabels,
  patientTotals,
  selectLabels,
} from "../../constants/appConstants";
import SelectionButtons from "../SelectionButtons";
import { breakString, removeCommasFromString } from "../../utils/StringUtils";
import { AiOutlineDelete } from "react-icons/ai";
import MinMaxSlider from "../MinMaxSlider";
import { MultiSelect } from "react-multi-select-component";
import interpolate from "color-interpolate";
import { AuthContext } from "../../context/AuthContext";
import { filterOutLabelsTable } from "../../utils/MapUtils";
import InputField from "../InputField";

let colormap = interpolate(["green", "white", "red"]);

const getMinValue = (data, label) => {
  let minValue = 0;
  data.forEach((item) => {
    if (parseFloat(item[label]) < minValue) {
      minValue = parseFloat(item[label]);
    }
  });
  return minValue;
};

const getMaxValue = (data, label) => {
  let minValue = 0;
  data.forEach((item) => {
    if (parseFloat(item[label]) > minValue) {
      minValue = parseFloat(item[label]);
    }
  });
  return minValue;
};
function normalizeValue(value, minValue, maxValue) {
  if (maxValue === minValue) {
    return 0.5;
  }

  if (value < 0) {
    // Normalize negative values to [0, 0.5]
    return (0.5 * (value - minValue)) / Math.abs(minValue);
  } else {
    // Normalize positive values to [0.5, 1]
    return 0.5 + 0.5 * (value / maxValue);
  }
}

// Function to interpolate color
function interpolateColor(value, minValue, midValue, maxValue) {
  let normalizedValue = normalizeValue(value, minValue, maxValue);
  return colormap(normalizedValue);
}
const BarChartOptions = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
  responsive: true,
  scales: {
    y: {
      ticks: {
        font: {
          size: 10,
          weight: 700,
        },
      },
    },
    x: {
      title: {
        display: true,
        text: "Patients",
      },
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value, index, ticks) {
          return value ? `${value}%` : 0;
        },
        font: {
          size: 10,
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        title: function (context) {
          let title = context[0].label;
          return removeCommasFromString(title);
        },
        label: function (context) {
          let label = context.formattedValue;
          return label ? `${label}%` : 0;
        },
      },
    },
  },
};

const Table = ({
  emptyTable,
  InstitutionalVariationTable,
  physicianName,
  setPhysicianName,
  hcpScatter,
  colorCells,
  updateTable = false,
  isEligible = false,
  setFilterList,
  cellClicked = () => {},
  filterList,
  filterState,
  showTopBtnsToggle = false,
  stateName,
  setStateName,
  isPayer = false,
  dispatch,
  value,
  setValue,
  handleDelete,
  stateNameList,
  organisationList,
  organisation,
  setorganisation,
  cleanedAffilitionList,
  cleanedAffilition,
  setCleanedAffilition,
  cleanedIDNList,
  cleanedIDN,
  setCleanedIDN,
  regionList,
  region,
  setRegion,
  setcurrentSize,
  selectionBtnsArray,
  specialityList,
  speciality,
  handleRowClicked,
  setSpeciality,
  currentSize,
  handleFilter,
  sortBy,
  sortOrder,
  handleSort,
  currentPage,
  totalPage,
  marginTop = "0rem",
  activeCells = true,
  Title = "",
  UserTable = false,
  initialState = {
    pageSize: 10,
    pageIndex: 0,
    sortBy: [
      {
        id: "Total_Claims",
        desc: true,
      },
    ],
  },
  setItemId,
  setCurrentPage = () => {},
  showSelectionBtns = true,
  TableData = [],
  TableColummns = EPL_TABLE_COLUMNS,
}) => {
  const data = React.useMemo(() => TableData, [TableData]);
  const columns = React.useMemo(() => TableColummns, [TableColummns]);
  const {
    getTableProps,
    allColumns,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({ columns, data, initialState }, useSortBy, usePagination);
  const [loading, setLoading] = useState(false);
  // const [openPopup, setOpenPopup] = useState(false);
  // const [barChartConfig, setBarChartConfig] = useState(null);

  const { selectedUnmet } = useContext(AuthContext);

  useEffect(() => {
    if (currentSize) {
      setPageSize(currentSize);
    }
  }, [currentSize, setPageSize]);

  const handleClick = (row) => {
    if (isEligible) {
      handleRowClicked(row);
    }
  };

  const handleFilterClick = (col) => {
    return col.toggleHidden();
  };

  const handleNext = () => {
    if (totalPage) {
      setCurrentPage((prev) => (prev === totalPage ? prev : prev + 1));
    } else {
      nextPage();
    }
  };

  const handlePrev = () => {
    if (totalPage) {
      setCurrentPage((prev) => (prev === 0 ? prev : prev - 1));
    } else {
      previousPage();
    }
  };

  const handleApplyFilters = () => {
    handleFilter(speciality, region, stateName, organisation);
  };

  const handleMultipleSelect = (val) => {
    setSpeciality(val);
  };

  const handleRegionSelect = (val) => {
    setRegion(val);
  };

  const handleStateName = (val) => {
    setStateName(val);
  };

  const handleOrganisationSelect = (val) => {
    setorganisation(val);
  };

  const handleToggleSelect = (val) => {
    allColumns.forEach((item) => {
      if (selectionBtnsArray.includes(item.id)) {
        if (item.isVisible) {
          item.toggleHidden();
        }
        val.forEach((_item) => {
          if (_item.value === item.Header) {
            item.toggleHidden();
          }
        });
      }
    });
    setValue(val);
  };

  const getBackgroundColor = (data, row) => {
    if (!data || !data.unmet_need_1) {
      return "transparent";
    }
    let orginalValue1 = row.original[data.unmet_need_1];
    let orginalValue2 = row.original[data.unmet_need_2];

    if (
      orginalValue1 >= parseInt(data.value_1) &&
      orginalValue2 >= parseInt(data.value_2)
    ) {
      return "rgba(255, 0, 0, 0.5)";
    }
    if (orginalValue1 >= parseInt(data.value_1)) {
      return "rgba(224, 176, 255, 0.5)";
    }
    if (orginalValue2 >= parseInt(data.value_2)) {
      return "rgba(75, 0, 130, 0.5)";
    }
    return "transparent";
  };

  useEffect(() => {
    if (showTopBtnsToggle) {
      let valHeaders = [];
      if (value) {
        valHeaders = value.map((item) => item.col.Header);
      }
      let _obj = {};
      selectedUnmet
        .filter((item) => item.value.toLowerCase().includes("percent"))
        .forEach((item) => {
          _obj[item.value] = item;
        });

      let _val = [];
      allColumns
        .filter((item) => selectionBtnsArray.includes(item.id))
        .forEach((item, index) => {
          if (
            !valHeaders.includes(item.Header) &&
            !_obj.hasOwnProperty(item.id) &&
            index !== 2
          ) {
            item.toggleHidden();
          }
          if (_obj.hasOwnProperty(item.id)) {
            _val.push({
              col: item,
              label: selectLabels[item.Header],
              value: item.Header,
            });
          }
          if (index === 2 && !value) {
            _val.push({
              col: item,
              label: selectLabels[item.Header],
              value: item.Header,
            });
          }
        });
      setValue(_val);
    }
  }, []);

  const handleFilterValueChange = (min, max, id) => {
    dispatch({
      type: "handleFilterChange",
      payload: {
        min,
        max,
        id,
      },
    });
  };

  const handleShowFilters = (val) => {
    dispatch({
      type: "handleResetFilterValues",
      payload: {
        val,
      },
    });
    setFilterList(val);
  };

  return (
    <div style={{ marginTop }} className="w-full max-w-full overflow-auto">
      <div className="flex items-center justify-between w-full">
        {Title && <div className="text-lg text-black font-[500]">{Title}</div>}
        {isEligible && (
          <button
            disabled={loading}
            onClick={handleApplyFilters}
            className="w-40 font-[600] h-10 border border-black rounded-md hover:bg-[#c4c4c4]"
          >
            {loading ? (
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
            ) : (
              "Apply Filter"
            )}
          </button>
        )}
      </div>
      {!showTopBtnsToggle && !UserTable && showSelectionBtns && (
        <SelectionButtons
          data={
            selectionBtnsArray
              ? allColumns.filter((item) =>
                  selectionBtnsArray.includes(item.id)
                )
              : allColumns
          }
          visibleKey={"isVisible"}
          onClick={handleFilterClick}
        />
      )}
      {isEligible ? (
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-8">
            <div className="flex items-center mt-2 gap-8">
              <label className="font-[600]">Select Unmet Needs</label>
              <MultiSelect
                labelledBy=""
                ItemRenderer={CustomOptionRenderer}
                options={
                  filterOutLabelsTable(
                    allColumns.filter((item) =>
                      selectionBtnsArray.includes(item.id)
                    ),
                    selectedUnmet
                  )
                    .map(
                      (item) =>
                        isNaN(item) && {
                          col: item,
                          label: selectLabels[item.Header],
                          value: item.Header,
                        }
                    )
                    .filter((item) => typeof item !== "boolean")
                  // .sort(
                  //   (a, b) =>
                  //     selectionBtnsArray.indexOf(a.col.id) -
                  //     selectionBtnsArray.indexOf(b.col.id)
                  // )
                }
                className="w-[30rem] z-[5]"
                value={value || []}
                onChange={(val) => handleToggleSelect(val)}
              />
            </div>
            <div className="flex items-center mt-2 gap-8">
              <label className="font-[600]">Select Filters</label>
              <MultiSelect
                labelledBy=""
                ItemRenderer={CustomOptionRenderer}
                options={Object.values(filterState).map((item) => ({
                  label: selectLabels[item.id],
                  value: item.id,
                }))}
                className="w-[30rem] z-[5]"
                value={filterList || []}
                onChange={(val) => handleShowFilters(val)}
              />
            </div>
          </div>

          <div className="flex flex-col items-start gap-8">
            <div className="flex items-center gap-4">
              {Object.values(filterState)
                .filter((item) => {
                  let _newFilterValue = filterList.map((item) => item.value);
                  return _newFilterValue.includes(item.id);
                })
                .map((item) => {
                  return (
                    <MinMaxSlider
                      handleValueChange={(min, max) =>
                        handleFilterValueChange(min, max, item.id)
                      }
                      minValue={item.min}
                      maxValue={item.max}
                      label={selectLabels[item.id]}
                    />
                  );
                })}
            </div>
            <div className="flex mt-2 items-center gap-4">
              {specialityList && (
                <div className="flex items-center gap-8">
                  <label className="font-[600]">Specialty</label>
                  <MultiSelect
                    labelledBy=""
                    options={specialityList
                      .map(
                        (item) => isNaN(item) && { label: item, value: item }
                      )
                      .filter((item) => typeof item !== "boolean")}
                    className="w-[20rem]"
                    value={speciality || []}
                    onChange={(val) => handleMultipleSelect(val)}
                  />
                </div>
              )}
              {regionList && (
                <div className="flex items-center gap-8">
                  <label className="font-[600]">Region</label>
                  <MultiSelect
                    labelledBy=""
                    options={regionList
                      .map(
                        (item) => isNaN(item) && { label: item, value: item }
                      )
                      .filter((item) => typeof item !== "boolean")}
                    className="w-[10rem]"
                    value={region || []}
                    onChange={(val) => handleRegionSelect(val)}
                  />
                </div>
              )}
              {organisationList && (
                <div className="flex items-center gap-8">
                  <label className="font-[600]">Health System / IDN</label>
                  <MultiSelect
                    labelledBy=""
                    options={organisationList
                      .map(
                        (item) => isNaN(item) && { label: item, value: item }
                      )
                      .filter((item) => typeof item !== "boolean")}
                    className="w-[10rem]"
                    value={organisation || []}
                    onChange={(val) => handleOrganisationSelect(val)}
                  />
                </div>
              )}
              {stateNameList && (
                <div className="flex items-center gap-8">
                  <label className="font-[600]">State</label>
                  <MultiSelect
                    labelledBy=""
                    options={stateNameList
                      .map(
                        (item) => isNaN(item) && { label: item, value: item }
                      )
                      .filter((item) => typeof item !== "boolean")}
                    className="w-[10rem]"
                    value={stateName || []}
                    onChange={(val) => handleStateName(val)}
                  />
                </div>
              )}
              {setPhysicianName && (
                <div className="flex items-center gap-8">
                  <label className="font-[600]">Physician Name</label>
                  <InputField
                    input={{
                      type: "text",
                      id: "Physician Name",
                      name: "Physician Name",
                      value: physicianName,
                    }}
                    onChange={(e) => setPhysicianName(e.target.value)}
                  />
                </div>
              )}
              {cleanedAffilitionList && (
                <div className="flex items-center gap-8">
                  <label className="font-[600]">
                    {isPayer ? "Payer Name" : "Hospital / Clinic"}
                  </label>
                  <MultiSelect
                    labelledBy=""
                    options={cleanedAffilitionList
                      .map(
                        (item) => isNaN(item) && { label: item, value: item }
                      )
                      .filter((item) => typeof item !== "boolean")}
                    className="w-[20rem]"
                    value={cleanedAffilition || []}
                    onChange={(val) => setCleanedAffilition(val)}
                  />
                </div>
              )}
              {cleanedIDNList && (
                <div className="flex items-center gap-8">
                  <label className="font-[600]">
                    {isPayer ? "Plan Name" : "Parent (IDN / Health System)"}
                  </label>
                  <MultiSelect
                    labelledBy=""
                    options={cleanedIDNList
                      .map(
                        (item) => isNaN(item) && { label: item, value: item }
                      )
                      .filter((item) => typeof item !== "boolean")}
                    className="w-[20rem]"
                    value={cleanedIDN || []}
                    onChange={(val) => setCleanedIDN(val)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {emptyTable || page.length === 0 ? (
        <div className="h-[20rem] grid place-content-center">
          No Data available
        </div>
      ) : (
        <table className="text-sm mt-4" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) =>
                  isEligible ? (
                    <th
                      key={index}
                      style={{ cursor: "pointer" }}
                      className={"hover:bg-slate-200"}
                      onClick={() => handleSort(column)}
                    >
                      {selectLabels[column.render("Header")]
                        ? selectLabels[column.render("Header")]
                        : column.render("Header")}
                      <span>
                        {sortBy === column.id ||
                        (column.id === "Name" && sortBy === "First Name")
                          ? sortOrder === "desc"
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ) : (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  )
                )}
                {(UserTable || InstitutionalVariationTable)&& <th></th>}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              let bg = "transparent";
              if (hcpScatter) {
                bg = getBackgroundColor(hcpScatter.data, row);
              }
              return (
                <tr
                  key={index}
                  style={{ backgroundColor: bg }}
                  className={`hover:bg-slate-300 relative cursor-pointer pr-20`}
                  onClick={() =>
                    activeCells ? handleClick(row) : cellClicked(row)
                  }
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell, index) => {
                    let cellValue = cell.render("Cell").props.value;
                    let _header = cell.render("Cell").props.column.Header;
                    let minValue = getMinValue(
                      cell.render("Cell").props.data,
                      invertedMapLabels[_header]
                    );
                    let maxValue = getMaxValue(
                      cell.render("Cell").props.data,
                      invertedMapLabels[_header]
                    );

                    let currentValue = parseFloat(cellValue);
                    let midValue = (maxValue - Math.abs(minValue)) / 2;
                    let background = colorCells
                      ? Object.values(selectLabels).includes(_header)
                        ? interpolateColor(
                            currentValue,
                            minValue,
                            midValue,
                            maxValue
                          )
                        : "transparent"
                      : "transparent";
                    return (
                      <td
                        style={{ background }}
                        key={index}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell").props.column.Header ===
                        "Top Priority" ? (
                          <span
                            style={{
                              background: cellValue ? "blue" : "transparent",
                            }}
                            className="w-3 h-3 flex rounded-full"
                          ></span>
                        ) : colorCells &&
                          Object.values(selectLabels).includes(_header) ? (
                          `${(cellValue * 100).toFixed(1)}%`
                        ) : typeof cellValue === "number" ? (
                          cell.render("Cell").props &&
                          cell.render("Cell").props.column.Header &&
                          cell
                            .render("Cell")
                            .props.column.Header.includes("Percent") ? (
                            `${cellValue.toFixed(2)}%`
                          ) : (
                            cellValue.toLocaleString()
                          )
                        ) : (
                          cell.render("Cell")
                        )}
                      </td>
                    );
                  })}
                  {(UserTable || InstitutionalVariationTable) && (
                    <td
                      role="cell"
                      onClick={(e) =>
                        InstitutionalVariationTable
                          ? handleDelete(e, row.values, row)
                          : setItemId(row.values.email)
                      }
                      className="w-[1rem] z-[4]  hover:scale-[1.2] transition-all ease-in-out duration-300 "
                    >
                      <AiOutlineDelete />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <div className="mt-4 flex items-center justify-between">
        {totalPage > 1 && (
          <div>
            {!totalPage && (
              <button
                className="hover:bg-primary hover:text-slate-50 cursor-pointer p-1"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                {"<<"}
              </button>
            )}{" "}
            <button
              className="hover:bg-primary hover:text-slate-50 cursor-pointer p-1"
              onClick={handlePrev}
              disabled={!totalPage && !canPreviousPage}
            >
              {"<"}
            </button>{" "}
            <button
              className="hover:bg-primary hover:text-slate-50 cursor-pointer p-1"
              onClick={handleNext}
              disabled={!totalPage && !canNextPage}
            >
              {">"}
            </button>{" "}
            {!totalPage && (
              <button
                className="hover:bg-primary hover:text-slate-50 cursor-pointer p-1"
                onClick={() =>
                  gotoPage(totalPage ? totalPage - 1 : pageCount - 1)
                }
                disabled={!canNextPage}
              >
                {">>"}
              </button>
            )}{" "}
            <span>
              Page{" "}
              <strong>
                {currentPage ? currentPage : pageIndex + 1} of{" "}
                {totalPage ? totalPage : pageOptions.length}
              </strong>{" "}
            </span>
            {/* <span>
          | Go to page:{" "}
          <input
            type="number"
            value={pageIndex+1}
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "} */}
            <select
              value={currentSize ? currentSize : pageSize}
              onChange={(e) => {
                if (totalPage) {
                  setcurrentSize(Number(e.target.value));
                  setPageSize(Number(e.target.value));
                } else {
                  setPageSize(Number(e.target.value));
                }
              }}
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {/* <Popup
        onClose={handleClose}
        modal
        open={openPopup && !UserTable}
        position="center center"
      >
        <div className="w-extraLarge">
          {barChartConfig && (
            <BarChart
              height={250}
              data={barChartConfig}
              options={BarChartOptions}
            />
          )}
        </div>
      </Popup> */}
    </div>
  );
};

export default Table;

export const CustomOptionRenderer = ({ checked, option, onClick }) => {
  const { selectedUnmet } = useContext(AuthContext);
  const [isPrioritized, setIsPrioritized] = useState({});

  useEffect(() => {
    if (selectedUnmet) {
      let selectedUnmetsObj = {};
      selectedUnmet.forEach((element) => {
        selectedUnmetsObj[element.value] = element;
      });
      setIsPrioritized(selectedUnmetsObj);
    }
  }, [selectedUnmet]);

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-2 cursor-pointer ${
        isPrioritized.hasOwnProperty(option.value)
          ? checked
            ? "bg-[#C0C0B0]"
            : "bg-[#FFFFE0]"
          : checked
          ? "bg-gray-200"
          : ""
      }`}
      style={{
        fontWeight: 600,
        color:
          option.label === "Select All"
            ? "#000"
            : patientTotals.includes(option.label)
            ? "#00008B"
            : "#800000",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {}}
        className="mr-2"
      />
      {option.label}
    </div>
  );
};
