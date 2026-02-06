import React from 'react'
import "./Bulb.css"

const Bulb = ({ isOn, onClick, index }) => {
    return (
        <button
            onClick={onClick}
            className={`light-bulb ${isOn ? 'on' : 'off'}`}
            aria-label={`Bulb ${index + 1}`}
            aria-pressed={isOn}
            type="button"
        >
        </button>
    )
}

export default Bulb
