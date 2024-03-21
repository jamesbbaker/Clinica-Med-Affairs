import React from "react";

const PrimaryBtn = ({onClick, className,type, text}) => {
  return <button onClick={onClick} type={type} className={`bg-primary focus:outline-none rounded-full text-center  font-medium py-2 active:scale-95 transition-all ease-in-out ${className}`}>{text}</button>;
};

export default PrimaryBtn;
