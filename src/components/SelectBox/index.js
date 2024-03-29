import React from "react";

const SelectBox = ({ error, input, handleSelect }) => {
  return (
    <div className={`w-full mt-2`}>
      <label
        for={input.id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {input.label}
      </label>
      <select
        name={input.name}
        onChange={handleSelect}
        id={input.id}
        className="bg-gray-50 focus:outline-none  px-4 py-2 border border-primary border-opacity-25 text-gray-900 text-sm rounded-lg block w-full"
      >
        <option selected disabled>
          Choose an option
        </option>
        {input.options.map((option) => (
          <option value={option.id}>{option.name}</option>
        ))}
      </select>
      <p className="mt-1 text-xs h-6 text-red-700">{error}</p>
    </div>
  );
};

export default SelectBox;
