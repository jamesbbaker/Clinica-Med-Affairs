import React, { useState } from "react";
import SelectionButtons from "../../../components/SelectionButtons";
import TreeMap from "../../../components/TreeMap";
import { EPL_TABLE_COLUMNS } from "../../../constants/appConstants";
import { removeOrAddColumn } from "../../../utils/MapUtils";

const data = [
  [
    "Location",
    "Parent",
    "Market trade volume (size)",
    "Market increase/decrease (color)",
  ],
  ["Global", null, 0, 0],
  ["1", "Global", 0, 0],
  ["2", "Global", 0, 0],
  ["3", "Global", 0, 0],
  ["4", "Global", 0, 0],
  ["5", "Global", 0, 0],
  ["6", "Global", 0, 0],
  ["7", "Global", 0, 0],
  ["8", "Global", 0, 0],
  ["9", "Global", 0, 0],
  ["cvRisk_1", "1", 48, -7],
  ["calciumBlocker_1", "1", 51, -1],
  ["monitoring_1", "1", 49, 23],
  ["offLabelTreatment_1", "1", 49, -39],
  ["nonAdherenceAnticoagulants_1", "1", 48, -31],
  ["incompleteTesting_1", "1", 50, -4],
  ["repeatedCardioversions_1", "1", 51, 12],
  ["supportTherapy_1", "1", 49, -13],
  ["manageAEs_1", "1", 53, 31],
  ["nonAdherenceAFDrugs_1", "1", 51, 5],
  ["failureFollowUp_1", "1", 52, 18],
  ["cvRisk_2", "2", 50, -36],
  ["calciumBlocker_2", "2", 54, -23],
  ["monitoring_2", "2", 51, -30],
  ["offLabelTreatment_2", "2", 48, 8],
  ["nonAdherenceAnticoagulants_2", "2", 52, -20],
  ["incompleteTesting_2", "2", 45, -11],
  ["repeatedCardioversions_2", "2", 47, 46],
  ["supportTherapy_2", "2", 50, 33],
  ["manageAEs_2", "2", 49, 40],
  ["nonAdherenceAFDrugs_2", "2", 52, -19],
  ["failureFollowUp_2", "2", 52, -14],
  ["cvRisk_3", "3", 55, 24],
  ["calciumBlocker_3", "3", 57, -43],
  ["monitoring_3", "3", 49, 2],
  ["offLabelTreatment_3", "3", 55, -17],
  ["nonAdherenceAnticoagulants_3", "3", 49, 25],
  ["incompleteTesting_3", "3", 53, -26],
  ["repeatedCardioversions_3", "3", 54, 48],
  ["supportTherapy_3", "3", 51, 18],
  ["manageAEs_3", "3", 54, -6],
  ["nonAdherenceAFDrugs_3", "3", 56, -29],
  ["failureFollowUp_3", "3", 58, 36],
  ["cvRisk_4", "4", 54, -5],
  ["calciumBlocker_4", "4", 51, -49],
  ["monitoring_4", "4", 50, 27],
  ["offLabelTreatment_4", "4", 53, -45],
  ["nonAdherenceAnticoagulants_4", "4", 53, 31],
  ["incompleteTesting_4", "4", 54, -41],
  ["repeatedCardioversions_4", "4", 54, -21],
  ["supportTherapy_4", "4", 51, -24],
  ["manageAEs_4", "4", 50, -25],
  ["nonAdherenceAFDrugs_4", "4", 52, 10],
  ["failureFollowUp_4", "4", 53, 2],
  ["cvRisk_5", "5", 47, -3],
  ["calciumBlocker_5", "5", 42, 10],
  ["monitoring_5", "5", 44, -14],
  ["offLabelTreatment_5", "5", 41, 7],
  ["nonAdherenceAnticoagulants_5", "5", 45, 3],
  ["incompleteTesting_5", "5", 46, -45],
  ["repeatedCardioversions_5", "5", 45, 17],
  ["supportTherapy_5", "5", 47, -8],
  ["manageAEs_5", "5", 40, 14],
  ["nonAdherenceAFDrugs_5", "5", 42, 38],
  ["failureFollowUp_5", "5", 45, -38],
  ["cvRisk_6", "6", 52, 31],
  ["calciumBlocker_6", "6", 49, 17],
  ["monitoring_6", "6", 47, 48],
  ["offLabelTreatment_6", "6", 47, -25],
  ["nonAdherenceAnticoagulants_6", "6", 51, -34],
  ["incompleteTesting_6", "6", 49, 33],
  ["repeatedCardioversions_6", "6", 47, 0],
  ["supportTherapy_6", "6", 48, 40],
  ["manageAEs_6", "6", 48, -5],
  ["nonAdherenceAFDrugs_6", "6", 50, -9],
  ["failureFollowUp_6", "6", 50, 9],
  ["cvRisk_7", "7", 57, 2],
  ["calciumBlocker_7", "7", 52, -34],
  ["monitoring_7", "7", 58, -23],
  ["offLabelTreatment_7", "7", 57, -6],
  ["nonAdherenceAnticoagulants_7", "7", 58, 37],
  ["incompleteTesting_7", "7", 55, 41],
  ["repeatedCardioversions_7", "7", 58, 45],
  ["supportTherapy_7", "7", 56, -25],
  ["manageAEs_7", "7", 60, 18],
  ["nonAdherenceAFDrugs_7", "7", 61, -15],
  ["failureFollowUp_7", "7", 61, -39],
  ["cvRisk_8", "8", 53, 23],
  ["calciumBlocker_8", "8", 47, -26],
  ["monitoring_8", "8", 52, -31],
  ["offLabelTreatment_8", "8", 52, 28],
  ["nonAdherenceAnticoagulants_8", "8", 52, 22],
  ["incompleteTesting_8", "8", 47, -18],
  ["repeatedCardioversions_8", "8", 47, 26],
  ["supportTherapy_8", "8", 52, -20],
  ["manageAEs_8", "8", 48, -47],
  ["nonAdherenceAFDrugs_8", "8", 55, -8],
  ["failureFollowUp_8", "8", 55, -3],
  ["cvRisk_9", "9", 55, -49],
  ["calciumBlocker_9", "9", 54, -15],
  ["monitoring_9", "9", 52, -30],
  ["offLabelTreatment_9", "9", 54, -21],
  ["nonAdherenceAnticoagulants_9", "9", 54, -25],
  ["incompleteTesting_9", "9", 54, -36],
  ["repeatedCardioversions_9", "9", 58, -36],
  ["supportTherapy_9", "9", 52, 49],
  ["manageAEs_9", "9", 58, -17],
  ["nonAdherenceAFDrugs_9", "9", 58, -27],
  ["failureFollowUp_9", "9", 58, -29],
];

const InstitutionalVariation = () => {
  const [TreeData, setTreeData] = useState(data);
  const [selectedValues, setSelectedValues] = useState(
    EPL_TABLE_COLUMNS.map((col) => col.accessor)
  );

  console.log(selectedValues);

  const filterItem = (col) => {
    let accessor = col.accessor;
    setSelectedValues((prev) => {
      let _prev = [...prev];
      if (_prev.includes(accessor)) {
        _prev = _prev.filter((item) => item != accessor);
      } else {
        _prev.push(accessor);
      }
      return _prev;
    });
    setTreeData((prev) => {
      let _prev = [...prev];
      return removeOrAddColumn(_prev, accessor);
    });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <SelectionButtons
        data={EPL_TABLE_COLUMNS}
        onClick={filterItem}
        selectedValues={selectedValues}
      />
      <TreeMap data={TreeData} />
    </div>
  );
};

export default InstitutionalVariation;
