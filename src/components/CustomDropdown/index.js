import React, { useState, useRef, useEffect, useContext } from 'react';
import { filterColors, mapLabels, mapSelectLabels, patientTotals } from '../../constants/appConstants';
import { AuthContext } from '../../context/AuthContext';

const CustomDropdown = ({buttonWidth = "20rem",showImpactColors = false, showColors = false, labelClassName, className, error, value, input, handleSelect, dotColors = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);
  const dropdownRef = useRef(null);
  const {selectedUnmet} = useContext(AuthContext)

  useEffect(() => {
    setSelectedOption(value)
  },[value])

  const handleOptionClick = (option) => {
   
    setSelectedOption(option.value);
    handleSelect(option.value);
    setIsOpen(false);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const selectedOptionObject = input.options.find(option => option.value === selectedOption);

  return (
    <div className={`w-full mt-2 ${className}`} ref={dropdownRef}>
      <label
        htmlFor={input.id}
        className={`block mr-4 text-sm font-medium text-gray-900 {labelClassName ? labelClassName : 'mb-2'}`}
      >
        {input.label}
      </label>
      <div style={{width: buttonWidth}} className="relative w-[20rem]">
        <button
          type="button"
          className="bg-gray-50  focus:outline-none px-4 py-2 border border-primary border-opacity-25 text-gray-900 text-sm rounded-lg block w-full text-left"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOptionObject ? selectedOptionObject.name : 'Select...'}
        </button>
        {isOpen && (
          <div className="absolute max-h-[20rem] overflow-y-auto z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            {input.options.map((option) => { 
              let selectedUnmetsObj = {}
              selectedUnmet.forEach(element => {
                selectedUnmetsObj[element.value] = element
              });
              return (
              <div
                key={option.name}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleOptionClick(option)}
                style={{
                  backgroundColor: selectedUnmetsObj.hasOwnProperty(option.value) ? option.value === selectedOption ? "#C0C0B0" : "#FFFFE0" : option.value === selectedOption ? '#c4c4c4' : 'transparent',
                }}
              >
                {showColors && (
                  <span
                    style={{
                      height: '10px',
                      minHeight: '10px',
                      maxHeight: "10px",
                      width: '10px',
                      minWidth: '10px',
                      maxWidth: '10px',
                      display: 'inline-block',
                      backgroundColor: (patientTotals.includes(option.value) ? '#00008B' : '#800000'),
                      borderRadius: '50%',
                      marginRight: '10px',
                    }}
                  ></span>
                )}
                {showImpactColors && (
                  <span
                    style={{
                      height: '10px',
                      minHeight: '10px',
                      maxHeight: "10px",
                      width: '10px',
                      minWidth: '10px',
                      maxWidth: '10px',
                      display: 'inline-block',
                      backgroundColor: filterColors[mapSelectLabels[mapLabels[option.value]]],
                      borderRadius: '50%',
                      marginRight: '10px',
                    }}
                  ></span>
                )}
                <span
                 
                >
                  {option.name}
                </span>
              </div>
            )})}
          </div>
        )}
      </div>
      {/* <p className="mt-1 text-xs h-6 text-red-700">{error}</p> */}
    </div>
  );
};

export default CustomDropdown;
