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
  return (
    <div
      id={name}
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
      className="w-20 h-20 border border-black flex justify-center items-center hover:bg-amber-100 text-4xl"
    >
      {mined && revealed && <GiJasmine className={iconStyles} />}
      {!mined && revealed && neighboringMines.length}
      {marked && !revealed && <GiLandMine className={iconStyles} />}
    </div>
  );
}
