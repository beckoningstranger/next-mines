import React from "react";

interface SquareProps {
  name: string;
  revealed: boolean;
  marked: boolean;
  mined: boolean;
  neighbors: string[];
}

const Square = ({ name, revealed, marked, mined, neighbors }: SquareProps) => {
  return <div>{name}</div>;
};

export default Square;
