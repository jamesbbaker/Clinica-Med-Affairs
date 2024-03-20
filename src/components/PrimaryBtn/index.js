import React from "react";

export const PrimaryBtn = ({ text, onClick }) => {
  return (
    <div className="relative w-full">
      <button
        type="submit"
        className="bg-primary relative z-0 rounded-full py-4 w-full text-slate-50 shadow-lg font-bold hover:shadow-lg transition-all ease-in-out active:scale-95"
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};
