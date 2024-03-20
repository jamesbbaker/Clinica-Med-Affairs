import React from "react";

export const PrimaryBtn = ({ text, onClick }) => {
  return (
    <div className="relative w-full">
      <button
        type="submit"
        className="shadow-lg hover:shadow-lg relative z-0 w-full rounded-full bg-primary py-4 font-bold text-slate-50 transition-all ease-in-out active:scale-95"
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};
