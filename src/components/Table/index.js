import fakeData from "./table-data.json";
import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useTable } from "react-table";
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
  UserTable = false,
  TableData = fakeData,
  TableColummns = EPL_TABLE_COLUMNS,
}) => {
  const data = React.useMemo(() => TableData, [TableData]);
  const columns = React.useMemo(() => TableColummns, []);

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
    allColumns.map(
      (column, index) => !UserTable && index % 2 && column.toggleHidden()
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
    <div className="w-screen max-w-full overflow-auto">
      {!UserTable && (
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
