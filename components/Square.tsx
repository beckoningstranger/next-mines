"use client";

import { MouseEvent } from "react";
import { GiJasmine, GiLandMine } from "react-icons/gi";

interface SquareProps {
  name: string;
  revealed: boolean;
  marked: boolean;
  mined: boolean;
  neighboringMines: string[];
  dispatch: Function;
  gameresult: string;
}

export default function Square({
  name,
  revealed,
  marked,
  mined,
  neighboringMines,
  dispatch,
  gameresult,
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

  switch (gameresult) {
    case "win":
      return (
        <div
          id={name}
          className={`m-[1px] flex h-[15px] w-[15px] items-center justify-center rounded border border-black bg-gradient-to-br from-green-700 via-green-500 
      to-emerald-800 text-xs font-bold transition-all duration-200 hover:bg-amber-100 lg:h-[37px] lg:w-[37px] lg:text-xl`}
        >
          {mined && <GiJasmine className={`${iconStyles} animate-spin-slow`} />}
        </div>
      );
    case "loss":
      return (
        <div
          id={name}
          className={`m-[1px] flex h-[15px] w-[15px] items-center justify-center rounded border border-black bg-gradient-to-br from-red-400 via-rose-500 
        to-red-800 text-xs font-bold transition-all duration-200 hover:bg-amber-100 lg:h-[37px] lg:w-[37px] lg:text-xl`}
        >
          {mined && <GiJasmine className={`${iconStyles} animate-spin-slow`} />}
        </div>
      );
    default:
      return (
        <div
          id={name}
          onClick={handleLeftClick}
          onContextMenu={handleRightClick}
          className={`m-[1px] flex h-[15px] w-[15px] items-center justify-center border border-black text-xs font-bold hover:bg-amber-100 lg:h-[37px] lg:w-[37px] lg:text-xl ${
            revealed ? "bg-slate-100" : "bg-slate-500"
          } ${
            revealed ? textColor() : "text-rose-500"
          } transition-all duration-200 hover:rotate-3 hover:scale-110`}
        >
          {mined && revealed && <GiJasmine className={iconStyles} />}
          {!mined && revealed && neighboringMines.length}
          {marked && !revealed && <GiLandMine className={iconStyles} />}
        </div>
      );
  }
}
