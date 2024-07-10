import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

const Slider = ({ id,  handleToggleLed }) => {
  const [isToggled, setIsToggled] = useState(localStorage.getItem(`ledState_${id}`) === 'true');
  const [value, setValue] = useState(0);

  useEffect(() => {
    const storedLedState = localStorage.getItem(`ledState_${id}`);
    if (storedLedState !== null) {
      setIsToggled(storedLedState === 'true');
    }
    
   
  }, [id]);

  const toggleLed = () => {
    const newLedState = !isToggled;
    setIsToggled(newLedState);
    localStorage.setItem(`ledState_${id}`, newLedState.toString());
    handleToggleLed(id);
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
