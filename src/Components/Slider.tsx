import React, { ChangeEvent, useState } from "react";

interface IProps {
    handleChange: (value: number) => void;
    initSliderVal: number;
}

const Slider = (props: IProps) => {
    const [sliderVal, setSliderVal] = useState<number>(props.initSliderVal);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setSliderVal(value);
        props.handleChange(value);
    };

    return (
        <input id="slider" type="range" min="1" max="20" className="slider" value={sliderVal} onChange={handleChange} />
    );
};

export default Slider;
