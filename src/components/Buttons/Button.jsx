import React from "react";
import { twMerge } from "tailwind-merge";

export default function Button({ onClick, text, className, children }) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        `p-2 rounded-md  mt-2 bg-gradient-to-r from-[#2d3142] via-[#2d3142] to-[#ef8354] text-white`,
        className
      )}
    >
      {text}
      {children}
    </button>
  );
}
