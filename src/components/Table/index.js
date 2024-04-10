import fakeData from "./table-data.json";
import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useTable,usePagination, useSortBy  } from "react-table";
import Popup from "reactjs-popup";
import BarChart from "../BarChart";
import { EPL_TABLE_COLUMNS } from "../../constants/appConstants";
import SelectionButtons from "../SelectionButtons";
import { breakString, removeCommasFromString } from "../../utils/StringUtils";

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
  ShowPagination = false,
  activeCells= true,
  Title="",
  UserTable = false,
  initialState={
    pageSize: 10,
    pageIndex: 0,
    sortBy: [
      {
          id: 'Total_Claims',
          desc: true
      }
  ]
  },
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
    state: { pageIndex, pageSize }
  } = useTable({ columns, data,initialState}, useSortBy,usePagination);
  const [openPopup, setOpenPopup] = useState(false);
  const [barChartConfig, setBarChartConfig] = useState(null);

  useEffect(() => {
    allColumns.map(
      (column, index) => !UserTable && showSelectionBtns && index % 2 && column.toggleHidden()
    );
  }, []);

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

  return (
    <div className="w-full mt-14 max-w-full overflow-auto">
      {Title && <div className="text-xs text-gray-500 font-semibold">{Title}</div>}
      {!UserTable &&showSelectionBtns && (
        <SelectionButtons
          data={allColumns}
          visibleKey={"isVisible"}
          onClick={handleFilterClick}
        />
      )}
      <table className="text-sm mt-4" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render("Header")}
                 <span>
               {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                className="hover:bg-slate-300 cursor-pointer"
                onClick={() =>activeCells && handleClick(row)}
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4">
        <button className="hover:bg-primary hover:text-slate-50 cursor-pointer p-1" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button className="hover:bg-primary hover:text-slate-50 cursor-pointer p-1" onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button className="hover:bg-primary hover:text-slate-50 cursor-pointer p-1" onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button className="hover:bg-primary hover:text-slate-50 cursor-pointer p-1" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
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
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
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
