import React from "react";

const PrimaryBtn = ({ type, disabled = false, onClick, className, text }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`bg-primary grid place-content-center rounded-full text-center font-medium py-2 active:scale-95 transition-all ease-in-out ${className}`}
    >
      {!disabled ? (
        text
      ) : (
        <div className="loader ease-linear rounded-full border-2 border-t-2 border-gray-200 h-6 w-6"></div>
      )}
    </button>
  );
};

export default PrimaryBtn;
