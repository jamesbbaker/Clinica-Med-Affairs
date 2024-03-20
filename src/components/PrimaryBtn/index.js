import React from "react";

const PrimaryBtn = ({onClick, className, text}) => {
  return <button onClick={onClick} className={`bg-primary text-center text-slate-50 font-medium py-2 ${className}`}>{text}</button>;
};

export default PrimaryBtn;
