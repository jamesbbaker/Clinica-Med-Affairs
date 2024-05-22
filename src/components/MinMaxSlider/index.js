import React from 'react'
import MultiRangeSlider from 'multi-range-slider-react'

const MinMaxSlider = ({label,minValue=0,maxValue=0, handleValueChange}) => {
    const handleOnChange = ({ minValue, maxValue }) => {

        handleValueChange(minValue, maxValue)
      };
    
    return (
      <div className='w-[20rem] px-2 mt-[2rem]'>
           <label className='font-[600]'>{label}</label>
        <p>Min Value: {minValue ? minValue: 0}</p>
        <p>Max Value: {maxValue ? maxValue :0}</p>
        <MultiRangeSlider
        minValue={minValue ? minValue : 0}
        maxValue={maxValue ? maxValue : 0}
        min={0}
        canMinMaxValueSame={true}
        max={100}
        label={false}
        ruler={false}
        style={{ border: "none", boxShadow: "none", padding: "15px 10px" }}
        onChange={handleOnChange} // Use 'onSlide' for value updates
      />
      </div>
    );
}

export default MinMaxSlider