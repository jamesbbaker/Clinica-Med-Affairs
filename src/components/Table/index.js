import fakeData from "./table-data.json";
import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
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

let colormap = interpolate(["green", "white", "red"]);

const getMinValue = (data, label) => {
  let minValue = 0;
  data.map((item) => {
    if (parseFloat(item[label]) < minValue) {
      minValue = parseFloat(item[label]);
    }
  });
  return minValue;
};

const getMaxValue = (data, label) => {
  let minValue = 0;
  data.map((item) => {
    if (parseFloat(item[label]) > minValue) {
      minValue = parseFloat(item[label]);
    }
  });
  return minValue;
};

const minColor = [0, 255, 0]; // Green in RGB
const midColor = [255, 255, 0];
const maxColor = [255, 0, 0]; // Red in RGB

function calculatePercentage(value, minValue, maxValue) {
  if (minValue === maxValue) {
    throw new Error("minValue and maxValue cannot be the same");
  }
  return ((value - minValue) / (maxValue - minValue)) * 100;
}

// Function to interpolate color
function interpolateColor(value, minValue, midValue, maxValue) {
  if (maxValue == 0) {
    maxValue = 1;
  }
  let percentage = calculatePercentage(value, minValue, maxValue);
  let _value = percentage / 100;
  let colro = colormap(_value);
  return colormap(_value);
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
  colorCells,
  isEligible = false,
  setFilterList,
  cellClicked = () => {},
  filterList,
  filterState,
  showTopBtnsToggle = false,
  stateName,
  setStateName,
  selectedIds,
  dispatch,
  setSelectedIds,
  value,
  setValue,
  stateNameList,
  organisationList,
  organisation,
  setorganisation,
  regionList,
  region,
  setRegion,
  setcurrentSize,
  selectionBtnsArray,
  specialityList,
  speciality,
  handleRowClicked,
  setSpeciality,
  icsNumber,
  setIcsNumber,
  steroidPercent,
  setsteroidPercent,
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
  TableData = fakeData,
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
  const [openPopup, setOpenPopup] = useState(false);
  const [barChartConfig, setBarChartConfig] = useState(null);
  const [filters, setFilters] = useState(false);

  useEffect(() => {
    if (currentSize) {
      setPageSize(currentSize);
    }
  }, [currentSize]);

  const handleClick = (row) => {
    if (isEligible) {
      handleRowClicked(row);
    } else {
      setOpenPopup((o) => !o);
      const barChartData = {
        labels: row.allCells.map((cell, index) =>
          breakString(cell.column.Header, 40)
        ),
        datasets: [
          {
            data: row.allCells.map((cell, index) => cell.value.split("%")[0]),
            borderColor: "rgb(155, 249, 122)",
            backgroundColor: "rgb(155, 249, 122, 0.4)",
          },
        ],
      };
      setBarChartConfig(barChartData);
    }
  };

  const handleClose = () => {
    setOpenPopup((o) => !o);
    setBarChartConfig(null);
  };

  const handleFilterClick = (col) => {
    return col.toggleHidden();
  };

  const handleNext = () => {
    if (totalPage) {
      setCurrentPage((prev) => (prev == totalPage ? prev : prev + 1));
    } else {
      nextPage();
    }
  };

  const handlePrev = () => {
    if (totalPage) {
      setCurrentPage((prev) => (prev == 0 ? prev : prev - 1));
    } else {
      previousPage();
    }
  };

  const handelIcsValueChange = (min, max) => {
    setIcsNumber({
      min,
      max,
    });
  };

  const handleSteroidPercent = (min, max) => {
    setsteroidPercent({
      min,
      max,
    });
  };

  const handleApplyFilters = () => {
    // if (icsNumber.max > 0 || steroidPercent.max > 0 || speciality) {
    handleFilter(
      icsNumber,
      steroidPercent,
      speciality,
      region,
      stateName,
      organisation
    );
    // }
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
  const firstRef = React.useRef(true);

  const handleToggleSelect = (val) => {
    allColumns.map((item) => {
      if (selectionBtnsArray.includes(item.id)) {
        if (item.isVisible) {
          item.toggleHidden();
        }
        val.map((_item) => {
          if (_item.value == item.Header) {
            item.toggleHidden();
          }
        });
      }
    });
    setValue(val);
    // if (firstRef.current) {
    //   // selectedIds.map(item => item.to)
    //   setSelectedIds(val);
    //   setValue(val);
    // }
    // let headerName = selectedIds.map((item) => item.col.Header);

    // val.map((item) => {
    //   !headerName.includes(item.col.Header) && item.col.toggleHidden();
    // });

    // firstRef.current = true;
    // let valHeaders = val.map((item) => item.col.Header);

    // selectedIds.map((item) => {
    //   !valHeaders.includes(item.col.Header) && item.col.toggleHidden();
    // });
    // setSelectedIds(val);

    // setValue(val);
  };

  useEffect(() => {
    if (showTopBtnsToggle) {
      let valHeaders = [];
      if (value) {
        valHeaders = value.map((item) => item.col.Header);
        firstRef.current = false;
      }
      allColumns
        .filter((item) => selectionBtnsArray.includes(item.id))
        .map((item, index) => {
          if (!valHeaders.includes(item.Header) && index !== 2) {
            item.toggleHidden();
          }
          if (index == 2) {
            setValue([
              {
                col: item,
                label: selectLabels[item.Header],
                value: item.Header,
              },
            ]);
          }
        });
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

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.data.color,
      color: "red",
    }),
    multiValue: (provided, state) => ({
      ...provided,
      backgroundColor: state.data.color,
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      color: patientTotals.includes(state.data.value) ? "#00008B" : "#800000",
    }),
  };

  return (
    <div style={{ marginTop }} className="w-full max-w-full overflow-auto">
      {Title && (
        <div className="text-md text-gray-500 font-semibold">{Title}</div>
      )}

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
                ItemRenderer={customOptionRenderer}
                options={allColumns
                  .filter((item) => selectionBtnsArray.includes(item.id))
                  .map(
                    (item) =>
                      isNaN(item) && {
                        col: item,
                        label: selectLabels[item.Header],
                        value: item.Header,
                      }
                  )
                  .filter((item) => typeof item !== "boolean")
                  .sort(
                    (a, b) =>
                      selectionBtnsArray.indexOf(a.col.id) -
                      selectionBtnsArray.indexOf(b.col.id)
                  )}
                className="w-[20rem] z-[5]"
                value={value || []}
                onChange={(val) => handleToggleSelect(val)}
              />
            </div>
            <div className="flex items-center mt-2 gap-8">
              <label className="font-[600]">Select Filters</label>
              <MultiSelect
                labelledBy=""
                ItemRenderer={customOptionRenderer}
                options={Object.values(filterState).map((item) => ({
                  label: selectLabels[item.id],
                  value: item.id,
                }))}
                className="w-[20rem] z-[5]"
                value={filterList || []}
                onChange={(val) => handleShowFilters(val)}
              />
            </div>
          </div>

          <div className="flex flex-col items-start gap-8">
            <div className="flex items-center gap-4">
              {Object.values(filterState).map((item) => {
                let _newFilterValue = filterList.map((item) => item.value);
                if (!_newFilterValue.includes(item.id)) {
                  return;
                }

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
              <div className="flex items-center gap-8">
                <label className="font-[600]">
                  Primary Specialty Description
                </label>
                <MultiSelect
                  labelledBy=""
                  options={specialityList
                    .map((item) => isNaN(item) && { label: item, value: item })
                    .filter((item) => typeof item !== "boolean")}
                  className="w-[20rem]"
                  value={speciality || []}
                  onChange={(val) => handleMultipleSelect(val)}
                />
              </div>
              <div className="flex items-center gap-8">
                <label className="font-[600]">Region</label>
                <MultiSelect
                  labelledBy=""
                  options={regionList
                    .map((item) => isNaN(item) && { label: item, value: item })
                    .filter((item) => typeof item !== "boolean")}
                  className="w-[10rem]"
                  value={region || []}
                  onChange={(val) => handleRegionSelect(val)}
                />
              </div>
              <div className="flex items-center gap-8">
                <label className="font-[600]">Organization</label>
                <MultiSelect
                  labelledBy=""
                  options={organisationList
                    .map((item) => isNaN(item) && { label: item, value: item })
                    .filter((item) => typeof item !== "boolean")}
                  className="w-[10rem]"
                  value={organisation || []}
                  onChange={(val) => handleOrganisationSelect(val)}
                />
              </div>
              <div className="flex items-center gap-8">
                <label className="font-[600]">State Name</label>
                <MultiSelect
                  labelledBy=""
                  options={stateNameList
                    .map((item) => isNaN(item) && { label: item, value: item })
                    .filter((item) => typeof item !== "boolean")}
                  className="w-[10rem]"
                  value={stateName || []}
                  onChange={(val) => handleStateName(val)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <table className="text-sm mt-4" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) =>
                isEligible ? (
                  <th onClick={() => handleSort(column)}>
                    {selectLabels[column.render("Header")]
                      ? selectLabels[column.render("Header")]
                      : column.render("Header")}
                    <span>
                      {sortBy === column.id ||
                      (column.id == "Name" && sortBy === "First Name")
                        ? sortOrder == "desc"
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ) : (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <tr
                key={index}
                className="hover:bg-slate-300 relative cursor-pointer pr-20"
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
                      {typeof cellValue === "number"
                        ? cell.render("Cell").props &&
                          cell.render("Cell").props.column.Header &&
                          cell
                            .render("Cell")
                            .props.column.Header.includes("Percent")
                          ? `${cellValue}%`
                          : cellValue.toLocaleString()
                        : cell.render("Cell")}{" "}
                    </td>
                  );
                })}
                {UserTable && (
                  <div
                    onClick={() => setItemId(row.values.email)}
                    className="absolute w-[1rem] z-[4] h-[100%] hover:scale-[1.2] transition-all ease-in-out duration-300 right-4 grid place-content-center"
                  >
                    <AiOutlineDelete />
                  </div>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-between">
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
        {isEligible && (
          <h2
            onClick={handleApplyFilters}
            className="text-[0.95rem] self-center px-3 py-1 border w-[8rem] grid place-content-center border-[#000] cursor-pointer hover:scale-[1.025] transition-all ease-linear duration-200 mr-3"
          >
            Apply Filters
          </h2>
        )}
      </div>
      <Popup
        onClose={() => setFilters(false)}
        modal
        open={filters}
        position="center center"
      >
        <div className="px-2 py-3 flex flex-col items-center gap-2 h-[50hvh] bg-#fff">
          <h2 className="text-[1.25rem]">Filters</h2>
          <div className="grid mt-10 grid-cols-2">
            <div className="flex gap-2 items-center">
              <label className="font-[600]">Sort By</label>
              <select className="w-[200px]">
                {columns.map((item, index) => (
                  <option key={index}>{item.Header}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <label className="font-[600]">Sort Order</label>
              <select className="w-[200px]">
                {["Ascending", "Descending"].map((item, index) => (
                  <option key={index}>{item}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="border border-black px-6 rounded-3xl mt-8 text-[0.875rem] font-[600] py-2 grid place-content-center">
            Submit
          </button>
        </div>
      </Popup>
      <Popup
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
      </Popup>
    </div>
  );
};

export default Table;

export const customOptionRenderer = ({ checked, option, onClick }) => {

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-2 cursor-pointer ${
        checked ? "bg-gray-200" : ""
      }`}
      style={{
        fontWeight: 600,
        color:
          option.label == "Select All"
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
