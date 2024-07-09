import React, { useState } from 'react';
import classNames from 'classnames';

const Slider = ({ handleToggleLed }) => {
  const [isToggled, setIsToggled] = useState(false);

  const toggleLed = () => {
    const newState = !isToggled;
    setIsToggled(newState);
    handleToggleLed(newState); // Call the handleToggleLed function with the new state
  };

  return (
    <div className="grid place-items-center flex items-center justify-center ml-16">
      <div className="relative">
        <input
          type="range"
          min="0"
          max="1"
          step="1"
          value={isToggled ? '1' : '0'}
          onChange={toggleLed}
          className={classNames(
            'w-16 h-6 rounded-full appearance-none cursor-pointer transition-colors duration-200 ',
            {
              'bg-gray-300': !isToggled,
              'bg-accent': isToggled,
            }
          )}
        />
      </div>
      <span className="">{isToggled ? 'On' : 'Off'}</span>
    </div>
  );
};

export default Slider;
