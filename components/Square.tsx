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
}: SquareProps) {
  console.log(`[Square ${name} rendering]...`);

  const [clicked, setClicked] = useState(revealed);
  const [flagged, setFlagged] = useState(marked);

  const handleLeftClick = (e: MouseEvent) => {
    if (!flagged && !clicked) {
      console.log("LeftClick");
      if (mined) {
        console.log("Boom!!");
      }
      setClicked(true);
    }
  };

  const handleRightClick = (e: MouseEvent): void => {
    e.preventDefault();
    if (!clicked) {
      console.log("RightClick");
      setFlagged(!flagged);
    }
  };

  const iconStyles = "w-8 h-8";
  return (
    <div
      id={name}
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
      className="w-10 h-10 border border-black flex justify-center items-center hover:bg-amber-100"
    >
      {mined && clicked && <GiJasmine className={iconStyles} />}
      {!mined && clicked && neighboringMines.length}
      {flagged && <GiLandMine className={iconStyles} />}
    </div>
  );
}
