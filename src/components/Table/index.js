import fakeData from "./table-data.json";
import * as React from "react";
import { useEffect } from "react";
import { useTable } from "react-table";

function Table() {
  const data = React.useMemo(() => fakeData, []);
  const columns = React.useMemo(
    () => [
      {
        Header: "Improper CV risk testing",
        accessor: "cvRisk",
      },
      {
        Header: "Improper calcium channel blocker",
        accessor: "calciumBlocker",
      },
      { Header: "Lack of monitoring by CV specialist", accessor: "monitoring" },
      {
        Header: "Off-label treatment High AF stroke risk without anticoagulant",
        accessor: "offLabelTreatment",
      },
      {
        Header: "Non-adherence to anticoagulants",
        accessor: "nonAdherenceAnticoagulants",
      },
      {
        Header:
          "Incomplete comorbidity testing Continued AF without treatment escalation",
        accessor: "incompleteTesting",
      },
      {
        Header: "Repeated cardioversions without treatment escalation",
        accessor: "repeatedCardioversions",
      },
      { Header: "Improper support of therapy", accessor: "supportTherapy" },
      { Header: "Failure to manage AEs", accessor: "manageAEs" },
      {
        Header: "Non-adherence to other AF drug treatments",
        accessor: "nonAdherenceAFDrugs",
      },
      {
        Header: "Failure to complete follow-up testing",
        accessor: "failureFollowUp",
      },
    ],
    []
  );

  const {
    getTableProps,
    allColumns,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  useEffect(() => {
    allColumns.map((column, index) => index % 2 && column.toggleHidden());
  }, []);

  return (
    <div className="w-screen max-w-full px-2 py-4 overflow-auto">
      <div className="flex flex-wrap items-center gap-2">
        {allColumns.map((column) => {
          return (
            <div
              onClick={() => column.toggleHidden()}
              className={`px-2 text-sm cursor-pointer  ${
                column.isVisible ? "bg-orange-300" : "hover:bg-orange-200"
              }  py-1 border border-gray-700 rounded-sm`}
            >
              {column.Header}
            </div>
          );
        })}
      </div>
      <table className="text-sm" {...getTableProps()}>
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
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
