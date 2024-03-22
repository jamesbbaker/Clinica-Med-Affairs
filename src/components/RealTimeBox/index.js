import React from "react";

let liveupdates = [
  {
    id: 1,
    text: "Dr. X has 5 new patients in May 2023 with unmet needs C, B, D",
  },
  {
    id: 2,
    text: "Dr. Y has referred 3 patients to a specialist for AF treatment",
  },
  { id: 3, text: "Dr. Z has prescribed new anticoagulants for 10 patients" },
  { id: 4, text: "Institution A has reported a 15% increase in AF diagnosis" },
  { id: 5, text: "Dr. W has completed follow-up testing for 8 patients" },
];

const RealTimeBox = () => {
  return (
    <div className="flex flex-col border rounded-md shadow-box-2 px-4 py-6 border-primary">
      <div className="px-2 w-full mb-4">
        <div className="text-lg font-semibold">Real Time Updates</div>
      </div>
      <div className="w-full flex flex-col gap-2 justify-between rounded-xl ">
        {liveupdates.map((item) => {
          return (
            <div
              key={item.id}
              className="w-full flex hover:bg-emerald-200 cursor-pointer bg-emerald-100 rounded-sm p-2 justify-between"
            >
              <div className="text-sm w-4/5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-1/2 bg-red-600"></div>
                {item.text}
              </div>
              <div className="w-4 h-4 object-contain">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    d="M256 73.82A182.18 182.18 0 1 0 438.18 256 182.18 182.18 0 0 0 256 73.82zm90.615 272.724a24.554 24.554 0 0 1-34.712 0l-54.664-54.667-57.142 57.146a24.544 24.544 0 0 1-34.704-34.717l57.138-57.128-53.2-53.209a24.547 24.547 0 0 1 34.712-34.717l53.196 53.208 50.717-50.72a24.547 24.547 0 0 1 34.713 34.716l-50.713 50.722 54.659 54.65a24.56 24.56 0 0 1 0 34.717z"
                    data-name="Close"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RealTimeBox;
