import React from "react";
import InputField from "../InputField";
import PrimaryBtn from "../PrimaryBtn";

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

const DemoContact = ( ) => {
  return (
    <div className="flex justify-center rounded-xl gap-6 flex-col items-center bg-white px-20 py-10">
      <h2 className="text-2xl font-[500]">Request a demo</h2>
      <div className="grid gap-4 grid-cols-2">
        {inputs.map((item) => (
          <InputField input={item} />
        ))}
      </div>
      <PrimaryBtn text={"Submit"} className={"w-full"} />
    </div>
  );
};

export default DemoContact;
