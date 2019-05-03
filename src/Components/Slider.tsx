import React, { useState } from 'react';

interface IProps {
    handleChange: any;
    initSliderVal: number
}

const Slider = (props: IProps) => {
    const [sliderVal, setSliderVal] = useState(props.initSliderVal);
    const handleChange = (e: any) => {
        setSliderVal(e.target.value);
        props.handleChange(e.target.value);
    }

    return (
        <input id="slider" type="range" min="1" max="20" className="slider" value={sliderVal} onChange={handleChange} />
    )
};

export default Slider;