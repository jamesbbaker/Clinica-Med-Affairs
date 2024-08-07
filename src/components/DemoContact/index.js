import React from "react";
import InputField from "../InputField";
import PrimaryBtn from "../PrimaryBtn";
import { IoCloseCircle } from "react-icons/io5";

const inputs = [
    {
        label: "First Name",
        name: "fName",
        type: "text"
    },
    {
        label: "Last Name",
        name: "lName",
        type: "text"
    },
    {
        label: "Email",
        name: "email",
        type: "email"
    },
    {
        label: "Company",
        name: "company",
        type: "text"
    },
]

const DemoContact = ( {handleClose}) => {
  return (
    <div className="flex justify-center relative rounded-xl gap-6 flex-col items-center bg-white px-20 py-10">
      <h2 className="text-2xl font-[500]">Request a demo</h2>
      <IoCloseCircle className="absolute top-4 right-0 cursor-pointer hover:scale-105 transition-all ease-in-out duration-150" size={30} onClick={handleClose} />
      <div className="grid gap-4 grid-cols-2">
        {inputs.map((item) => (
          <InputField input={item} />
        ))}
      </div>
      <PrimaryBtn text={"Submit"} className={"w-full bg-[#0A1172] hover:scale-105 transition-all ease-in-out duration-200 text-[#fff]"} />
    </div>
  );
};

export default DemoContact;
