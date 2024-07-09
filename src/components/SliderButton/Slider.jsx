import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

const Slider = ({handleToggleLed}) => {
    const [isToggled, setIsToggled] = useState(localStorage.getItem('ledState') === 'true');

    useEffect(() => {
        const storedLedState = localStorage.getItem('ledState');
        if (storedLedState !== null) {
            setIsToggled(storedLedState === 'true');
        }
    }, []);

    const toggleLed = () => {
        const newLedState = !isToggled;
        setIsToggled(newLedState);
        localStorage.setItem('ledState', newLedState.toString());
        // Additional actions or callbacks based on newLedState if needed
        handleToggleLed();
    };

    return (
        <div className="grid place-items-center w-full">
            <div className="relative">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="1"
                    value={isToggled ? '1' : '0'}
                    onChange={toggleLed}
                    className={classNames(
                        'w-16 h-6 rounded-full appearance-none cursor-pointer transition-colors duration-200',
                        {
                            'bg-gray-300': !isToggled,
                            'bg-accent': isToggled,
                        }
                    )}
                />
            </div>
            <span>{isToggled ? 'On' : 'Off'}</span>
        </div>
    );
};

export default Slider;
