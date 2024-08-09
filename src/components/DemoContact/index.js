import React from "react";
import InputField from "../InputField";
import PrimaryBtn from "../PrimaryBtn";
import { IoCloseCircle } from "react-icons/io5";
import contactImg from "../../assets/images/contact.png"

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
    <div className="flex md:py-0 my-10 max-h-[80vh] md:max-h-[100%] overflow-y-auto flex-col relative md:flex-row items-center justify-center">
      <IoCloseCircle className="fixed top-12 right-4  cursor-pointer hover:scale-105 transition-all ease-in-out duration-150" size={30} onClick={handleClose} />
      <img src={contactImg} alt="mobile img" className="w-[40rem] md:mt-0 mt-40" />
    <div className="flex justify-center  rounded-xl md:gap-6 gap-2 w-full flex-col items-center bg-white md:px-10 px-0 py-10">
      <h2 className="text-2xl font-[500]">Request a demo</h2>
      
      <div className="grid md:gap-4 gap-2 w-full grid-cols-1">
        {inputs.map((item) => (
          <InputField input={item} />
        ))}
      </div>
      <PrimaryBtn text={"Submit"} className={"w-full bg-[#0A1172] hover:scale-105 transition-all ease-in-out duration-200 text-[#fff]"} />
    </div>
    </div>
  );
};

export default DemoContact;
