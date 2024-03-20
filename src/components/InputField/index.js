import React from "react";

const InputField = ({ input, onChange = () => {} }) => {
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
    </div>
  );
};

export default InputField;
