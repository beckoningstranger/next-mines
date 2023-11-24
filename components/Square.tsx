"use client";

import { MouseEvent, useState } from "react";
import { GiJasmine, GiLandMine } from "react-icons/gi";

interface SquareProps {
  name: string;
  revealed: boolean;
  marked: boolean;
  mined: boolean;
  neighboringMines: string[];
  dispatch: Function;
}

export default function Square({
  name,
  revealed,
  marked,
  mined,
  neighboringMines,
  dispatch,
}: SquareProps) {
  const handleLeftClick = (e: MouseEvent) => {
    if (!marked && !revealed) {
      dispatch({ type: "REVEAL", payload: name });
    }
    if (!marked && revealed) {
      dispatch({ type: "CHORD", payload: name });
    }
  };

  const handleRightClick = (e: MouseEvent): void => {
    e.preventDefault();
    if (!revealed && !marked) {
      dispatch({ type: "MARK", payload: name });
    }
    if (!revealed && marked) {
      dispatch({ type: "UNMARK", payload: name });
    }
  };

  const iconStyles = "w-8 h-8";

  const textColor = () => {
    switch (neighboringMines.length) {
      case 1:
        return "text-black";
      case 2:
        return "text-amber-500";
      case 3:
        return "text-rose-600";
      case 4:
        return "text-blue-600";
      case 5:
        return "text-fuchsia-600";
      case 6:
        return "text-purple-800";
      case 7:
        return "text-green-700";
      case 8:
        return "text-amber-900";
      default:
        return "text-transparent";
    }
  };
  console.log(name, mined, neighboringMines.length);
  return (
    <div
      id={name}
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
      className={`m-[1px] flex w-[15px] h-[15px] lg:w-[37px] lg:h-[37px] lg:text-xl font-bold border border-black  justify-center items-center hover:bg-amber-100 text-xs ${
        revealed ? "bg-slate-100" : "bg-slate-500"
      } ${
        revealed ? textColor() : "text-rose-500"
      } hover:scale-110 hover:rotate-3 transition-all duration-200`}
    >
      {mined && revealed && <GiJasmine className={iconStyles} />}
      {!mined && revealed && neighboringMines.length}
      {marked && !revealed && <GiLandMine className={iconStyles} />}
    </div>
  );
}
