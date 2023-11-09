"use client";

import { MouseEvent, useState } from "react";
import { GiJasmine, GiLandMine } from "react-icons/gi";

interface SquareProps {
  name: string;
  revealed: boolean;
  marked: boolean;
  mined: boolean;
  neighbors: string[];
  neighboringMines: string[];
}

const Square = ({
  name,
  revealed,
  marked,
  mined,
  neighbors,
  neighboringMines,
}: SquareProps) => {
  console.log(`[Square ${name} rendering]...`);

  const [clicked, setClicked] = useState(revealed);

  const handleLeftClick = (e: MouseEvent) => {
    console.log("LeftClick");
    if (mined) {
      console.log("Boom!!");
    }
    setClicked(true);
  };

  const handleRightClick = (e: MouseEvent): void => {
    e.preventDefault();
    console.log("RightClick");
  };

  const styles =
    "w-10 h-10 border border-black flex justify-center items-center";
  return (
    <div id={name} onClick={handleLeftClick} onContextMenu={handleRightClick}>
      {mined && clicked ? (
        <GiJasmine className={styles} />
      ) : (
        <div className={styles}>{clicked && neighboringMines.length}</div>
      )}
    </div>
  );
};

export default Square;