import fakeData from "./table-data.json";
import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import Popup from "reactjs-popup";
import BarChart from "../BarChart";
import { EPL_TABLE_COLUMNS } from "../../constants/appConstants";
import SelectionButtons from "../SelectionButtons";
import { breakString, removeCommasFromString } from "../../utils/StringUtils";
import { AiOutlineDelete } from "react-icons/ai";
import MinMaxSlider from "../MinMaxSlider";
import { MultiSelect } from "react-multi-select-component";

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
  setcurrentSize,
  selectionBtnsArray,
  specialityList,
  speciality,
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
      setPageSize(currentSize)
    }
  },[currentSize])

  const handleClick = (row) => {
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
    if (icsNumber.max > 0 || steroidPercent.max > 0 || speciality.length> 0) {
      handleFilter(icsNumber, steroidPercent,speciality)
    }
  }


  const handleMultipleSelect = (val) => {
 
    setSpeciality(val)
   
  };





  return (
    <div style={{ marginTop }} className="w-full max-w-full overflow-auto">
      {Title && (
        <div className="text-md text-gray-500 font-semibold">{Title}</div>
      )}

      {!UserTable && showSelectionBtns && (
        <SelectionButtons
          data={selectionBtnsArray ? allColumns.filter(item => selectionBtnsArray.includes(item.id))  :allColumns}
          visibleKey={"isVisible"}
          onClick={handleFilterClick}
        />
      )}
      {totalPage && (
        <div className="flex items-center gap-2">
          <MinMaxSlider
            handleValueChange={handelIcsValueChange}
            minValue={icsNumber.min}
            maxValue={icsNumber.max}
            label={"Number of ICS-LABA Patients"}
          />
          <MinMaxSlider
            handleValueChange={handleSteroidPercent}
            minValue={steroidPercent.min}
            maxValue={steroidPercent.max}
            label={"Percent of High Steroid Usage Patients"}
          />
          <div className="flex items-start flex-col gap-8">
            <label className="font-[600]">Primary Specialty Description</label>
           <MultiSelect
                labelledBy=""
                options={specialityList.map(item =>isNaN(item) && ({label: item, value: item})).filter(item => typeof item !== "boolean")}
                className="w-[10rem]"
                value={speciality || []}
                onChange={(val) => handleMultipleSelect(val)}
              />
              </div>
        </div>
      )}
      <table className="text-sm mt-4" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) =>
                totalPage ? (
                  <th onClick={() => handleSort(column)}>
                    {column.render("Header")}
                    <span>
                      {sortBy === column.id
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
          {page.map((row) => {
            prepareRow(row);

            return (
              <tr
                className="hover:bg-slate-300 relative cursor-pointer pr-20"
                onClick={() => activeCells && handleClick(row)}
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => {
                  let cellValue = cell.render("Cell").props.value;

                  return (
                    <td {...cell.getCellProps()}>
                      {typeof cellValue === "number"
                        ? cellValue.toLocaleString()
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
              <option
                key={pageSize}
                value={pageSize}
              >
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      {totalPage  && <h2
          onClick={handleApplyFilters}
          className="text-[0.95rem] self-center px-3 py-1 border w-[8rem] grid place-content-center border-[#000] cursor-pointer hover:scale-[1.025] transition-all ease-linear duration-200 mr-3"
        >
          Apply Filters
        </h2>}
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
                {columns.map((item) => (
                  <option>{item.Header}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <label className="font-[600]">Sort Order</label>
              <select className="w-[200px]">
                {["Ascending", "Descending"].map((item) => (
                  <option>{item}</option>
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
