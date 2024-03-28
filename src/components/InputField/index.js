import React from "react";

const InputField = ({ error, input, onChange = () => {} }) => {
  return (
    <div
      className={`${
        input.type == "checkbox" && "flex items-center gap-2 col-span-2"
      } ${input.name == "company" && "col-span-2"} w-full mt-2`}
    >
      <h1
        className={`font-medium text-sm ${input.type !== "checkbox" && "mb-2"}`}
      >
        {input.label}
      </h1>
      <input
        id={input.id}
        value={input.value}
        name={input.name}
        type={input.type}
        onChange={onChange}
        className={`px-4 py-2 ${
          input.type !== "checkbox" && "w-full"
        } text-sm rounded-md focus:outline-none border-primary border-opacity-25 border`}
        placeholder={input.placeholder}
      />
      <p className="mt-1 text-xs h-6 text-red-700">{error}</p>
    </div>
  );
};

export default InputField;
