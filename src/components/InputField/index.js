import React from "react";

const InputField = ({ error, input, onChange = () => {} }) => {
  console.log(error);
  return (
    <div>
      <h1 className="font-medium">{input.label}</h1>
      <input
        name={input.name}
        type={input.type}
        onChange={onChange}
        className="px-4 py-2 mt-2 focus:outline-none border-primary w-full border-opacity-25 border"
        placeholder={input.placeholder}
      />
      <p className="mt-1 h-6 text-red-700"> {error}</p>
    </div>
  );
};

export default InputField;
