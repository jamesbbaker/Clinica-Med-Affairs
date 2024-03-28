import fakeData from "./table-data.json";
import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useTable } from "react-table";
import Popup from "reactjs-popup";
import BarChart from "../BarChart";
import { EPL_TABLE_COLUMNS } from "../../constants/appConstants";

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
          size: 12,
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
        label: function (context) {
          console.log(context);
          let label = context.formattedValue;
          return label ? `${label}%` : 0;
        },
      },
    },
  },
};

function Table() {
  const data = React.useMemo(() => fakeData, []);
  const columns = React.useMemo(() => EPL_TABLE_COLUMNS, []);

  const {
    getTableProps,
    allColumns,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });
  const [openPopup, setOpenPopup] = useState(false);
  const [barChartConfig, setBarChartConfig] = useState(null);

  useEffect(() => {
    allColumns.map((column, index) => index % 2 && column.toggleHidden());
  }, []);

  const handleClick = (row) => {
    setOpenPopup((o) => !o);
    const barChartData = {
      labels: row.allCells.map((cell, index) => cell.column.Header),
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

  return (
    <div className="w-screen max-w-full overflow-auto">
      <div className="flex flex-wrap items-center gap-2">
        {allColumns.map((column) => {
          return (
            <div
              onClick={() => column.toggleHidden()}
              className={`px-2 text-xs cursor-pointer  ${
                column.isVisible ? "bg-orange-300" : "hover:bg-orange-200"
              }  py-1 border border-gray-700 rounded-sm`}
            >
              {column.Header}
            </div>
          );
        })}
      </div>
      <table className="text-sm mt-4" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                className="hover:bg-slate-300 cursor-pointer"
                onClick={() => handleClick(row)}
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Popup
        onClose={handleClose}
        modal
        open={openPopup}
        position="center center"
      >
        <div>
          {barChartConfig && (
            <BarChart
              height={120}
              data={barChartConfig}
              options={BarChartOptions}
            />
          )}
        </div>
      </Popup>
    </div>
  );
}

export default Table;
