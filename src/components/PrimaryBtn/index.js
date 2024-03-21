import React from "react";

const PrimaryBtn = ({onClick, className, text}) => {
  return <button onClick={onClick} className={`bg-primary rounded-full text-center font-medium py-2 active:scale-95 transition-all ease-in-out ${className}`}>{text}</button>;
};

export default PrimaryBtn;
