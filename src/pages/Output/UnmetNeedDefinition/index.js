import React, { useState } from 'react'
import unmetChart from "../../../assets/images/unmetChart.png"
import Popup from "reactjs-popup";

const UnmetNeedDefinitionData = {
    id1: {
        id: "id1",
        treatmentDecision: "Key treatment decisions",
        patientNeed: "",
        color: "#8CC9E6"
    },
    id2: {
        id: "id2",
        treatmentDecision: "After diagnosis, do patients receive a spirometry test?",
        patientNeed: "Incomplete initial asthma testing",
        color: "#8CC9E6"
    },
    id3: {
        id: "id3",
        treatmentDecision: "Do severe or uncontrolled asthma patients receive IGE and EOS/CBC testing?",
        patientNeed: "Improper severe asthma testing",
        color: "#8CC9E6"
    },
    id4: {
        id: "id4",
        treatmentDecision: "Treatment (all lines of therapy)",
        patientNeed: "",
        color: "#6FA9D9"
    },
    id5: {
        id: "id5",
        treatmentDecision: "Do patients diagnosed with asthma receive any treatment at all?",
        patientNeed: "Untreated patients",
        color: "#6FA9D9"
    },
    id6: {
        id: "id6",
        treatmentDecision: "Are uncontrolled or severe patients receiving ICS/beta-agonists escalated to double therapy?",
        patientNeed: "Failure to escalate uncontrolled/severe patients to double therapy",
        color: "#6FA9D9"
    },
    id7: {
        id: "id7",
        treatmentDecision: "How long does it take from demonstrating severe/uncontrolled asthma to treatment escalation?",
        patientNeed: "Delay in escalating patients to double therapy",
        color: "#6FA9D9"
    },
    id8: {
        id: "id8",
        treatmentDecision: "Are uncontrolled or severe patients receiving double therapies escalated to triple therapy?",
        patientNeed: "Failure to escalate uncontrolled/severe patients to triple therapy",
        color: "#6FA9D9"
    },
    id9: {
        id: "id9",
        treatmentDecision: "How long does it take from demonstrating severe/uncontrolled asthma to treatment escalation?",
        patientNeed: "Delay in escalating patients from double to triple therapy",
        color: "#6FA9D9"
    },
    id10: {
        id: "id10",
        treatmentDecision: "Do patients receive open triple therapies?",
        patientNeed: "Suboptimal use of open triple therapy",
        color: "#6FA9D9"
    },
    id11: {
        id: "id11",
        treatmentDecision: "Do patients receive excessive OCS by either consistency or quantity of use?",
        patientNeed: "Excessive steroid usage",
        color: "#6FA9D9"
    },
    id12: {
        id: "id12",
        treatmentDecision: "Therapy support and adherence",
        patientNeed: "",
        color: "#94D3A2"
    },
    id13: {
        id: "id13",
        treatmentDecision: "Are patients adherent to their double treatments?",
        patientNeed: "Non-adherence to double therapies",
        color: "#94D3A2"
    },
    id14: {
        id: "id14",
        treatmentDecision: "Are patients adherent to open triple treatments?",
        patientNeed: "Non-adherence to open triple therapies",
        color: "#94D3A2"
    },
    id15: {
        id: "id15",
        treatmentDecision: "Are patients adherence to closed triple treatments?",
        patientNeed: "Non-adherence to closed triple therapies",
        color: "#94D3A2"
    },
    id16: {
        id: "id16",
        treatmentDecision: "Therapy support and adherence",
        patientNeed: "No specific patient need mentioned",
        color: "#7DD892"
    }
};

const UnmetNeedDefinition = () => {
    const [modalId, setModalId] = useState(null)

    const handleClose = () => {
        setModalId(null)
    }

    const handleClick = (key) => {
        setModalId(key)
    }

  return (
    <div className='grid grid-cols-3 items-center pb-24'>
    <div className='px-4 py-2 font-semibold text-lg'>Key Treatment Decisions</div>
    <div className='px-4 py-2 font-semibold text-lg'>Area of patient need</div>
    <div className='px-4 py-2 font-semibold text-lg'>Asthma Clinical Patient Treatment Trajectory</div>
    <div className='grid grid-cols-2 col-span-2 '>
        {Object.keys(UnmetNeedDefinitionData).map((key) => {
            return (
                <div className='col-span-2' key={key}>
                    <div className={`bg-white px-4 ${UnmetNeedDefinitionData[key].patientNeed ? "py-2" : "py-1"} gap-6 grid grid-cols-2 items-center rounded`}>
                        <div className='flex col-span-1 items-center justify-between'>
                            <h2 style={UnmetNeedDefinitionData[key].patientNeed ?{} : {color: `${UnmetNeedDefinitionData[key].color}`} } className={`text-sm ${UnmetNeedDefinitionData[key].patientNeed ? `font-medium text-gray-700`: `font-bold`} `}>{UnmetNeedDefinitionData[key].treatmentDecision}</h2>
                        </div>
                        {UnmetNeedDefinitionData[key].patientNeed && <button onClick={() => handleClick(key)} style={{borderColor:UnmetNeedDefinitionData[key].color }} className={`text-gray-700 hover:scale-105 transition-all ease-linear border-2 px-4 py-2`}>{UnmetNeedDefinitionData[key].patientNeed}</button>}
                    </div>
                </div>
            )
        })}
    </div>
    <div className='col-span-1'>
            <img src={unmetChart} className='w-100 h-100 border-l-2 border-l-slate-900' alt='unmetChart'/>
        </div>
        <Popup
        onClose={handleClose}
        modal
        open={modalId != null}
        position="center center"
      >
       {modalId && <div className="w-extraLarge h-extraLarge flex flex-col gap-2 items-center justify-center bg-white">
          <div className='text-lg font-semibold'>{UnmetNeedDefinitionData[modalId].patientNeed}</div>
          <div className='text-sm'>{UnmetNeedDefinitionData[modalId].treatmentDecision}</div>
        </div>}
      </Popup>
    </div>
  )
}

export default UnmetNeedDefinition