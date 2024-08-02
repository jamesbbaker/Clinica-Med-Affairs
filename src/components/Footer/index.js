import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/termsandconditions");
  };

  return (
    <>
    <div className="py-8 bg-gray-100 w-full grid place-content-center">
      <h2 onClick={handleClick} className="text-gray-600">
        Terms & Conditions
      </h2>
    </div>
    </>
  );
};

export default Footer;
