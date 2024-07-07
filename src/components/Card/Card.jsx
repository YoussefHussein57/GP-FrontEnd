import React from "react";
import { twMerge } from "tailwind-merge";

function Card(props) {
  return (
    <div
      className={twMerge(
        "bg-primary flex flex-col gap-8  flex-1 rounded-3xl border-2  stroke stroke-gray-600 overflow-y-auto p-4 ",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

export default Card;
