import React from "react";
import Lottie from "react-lottie";
import animationData from "../../lotties/Animation .json";

const UnderConstruction= () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className=" grid place-items-center ">
      <Lottie options={defaultOptions} height={600} width={600} />
      <h2>
        Our website is under construction. We are working very hard to give you
        the best experience on our new web site.
      </h2>
    </div>
  );
};
export default UnderConstruction;
