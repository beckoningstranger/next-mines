"use client";

import { useReducer } from "react";
import Square from "./Square";

interface square {
  name: string;
  mined: boolean;
  revealed: boolean;
  marked: boolean;
  neighbors: string[];
  neighboringMines: string[];
  markedNeighbors: string[];
}

interface meta {
  rows: number;
  columns: number;
  mines: number;
  createdAt?: Date;
  finishedAt?: Date | null;
  playerID?: number;
  playerActions: string[];
  won: boolean;
  inProgress: boolean;
  completionTime: number | null;
  revealToWin: string[];
}

interface gameState {
  gameData: square[];
  metaData: meta;
}

enum ActionKind {
  Reveal = "REVEAL",
  Mark = "MARK",
  Chord = "CHORD",
}

type Action = {
  type: ActionKind;
  payload?: string;
};

interface gameProps {
  rows: number;
  columns: number;
  mines: number;
}

function Minesweeper() {
  const rows = 4;
  const columns = 7;
  const mines = 5;
  const initialState: gameState = createGame({
    rows: rows,
    columns: columns,
    mines: mines,
  });

  const reducer = (state: gameState, action: Action): gameState => {
    const { type, payload } = action;
    const square = state.gameData.filter((x) => x.name === payload)[0];

    switch (type) {
      case ActionKind.Reveal:
        if (square.mined === true) {
          console.log("BOOM, you lose!");
        } else {
          square.revealed = true;
          if (square.neighboringMines.length === 0) {
            square.neighbors.map((neighborSquareName) => {
              const neighborSquare = state.gameData.filter(
                (x) => x.name === neighborSquareName
              )[0];
              neighborSquare.revealed = true;
            });
          }
        }

        return {
          ...state,
        };

      case ActionKind.Mark:
        square.marked = !square.marked;
        if (square.marked) {
          square.neighbors.map((x) => {
            const squareToUpdate = state.gameData.filter(
              (sq) => sq.name === x
            )[0];
            squareToUpdate.markedNeighbors.push(square.name);
          });
        } else {
          square.neighbors.map((x) => {
            const squareToUpdate = state.gameData.filter(
              (sq) => sq.name === x
            )[0];
            squareToUpdate.markedNeighbors.splice(
              squareToUpdate.markedNeighbors.indexOf(square.name),
              1
            );
          });
        }

        return {
          ...state,
        };

      case ActionKind.Chord:
        console.log("Chording square", payload);
        if (square.markedNeighbors.length === square.neighboringMines.length) {
          console.log("Chording is possible");
          square.neighbors.map((neighborSquareName) => {
            const neighborSquare = state.gameData.filter(
              (x) => x.name === neighborSquareName
            )[0];
            if (!neighborSquare.marked) {
              neighborSquare.revealed = true;
            }
          });
        } else {
          console.log(
            "Chording is NOT possible",
            square.markedNeighbors.length,
            square.markedNeighbors,
            "!==",
            square.neighboringMines.length
          );
        }

        return {
          ...state,
        };
      default:
        throw new Error("Unknown action type!");
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const revealSquareAction: Action = { type: ActionKind.Reveal };
  const markSquareAction: Action = { type: ActionKind.Mark };
  const ChordAction: Action = { type: ActionKind.Chord };

  // console.log(`[Minesweeper rendering]...`);

  // const styles = `grid grid-cols-${columns} bg-red-200 select-none justify-items-center m-5 p-6`;
  const styles =
    "grid grid-cols-7 bg-red-200 select-none justify-items-center m-5 p-6";
  return (
    <div className={styles}>
      {state.gameData.map((square) => (
        <Square
          key={square.name}
          name={square.name}
          revealed={square.revealed}
          marked={square.marked}
          neighboringMines={square.neighboringMines}
          mined={square.mined}
          dispatch={dispatch}
        />
      ))}
    </div>
  );
}

function createGame({ rows, columns, mines }: gameProps): gameState {
  const game: gameState = {
    gameData: [],
    metaData: {
      rows: rows,
      columns: columns,
      mines: mines,
      revealToWin: [],
      playerID: 0,
      playerActions: [],
      completionTime: null,
      createdAt: new Date(),
      finishedAt: null,
      won: false,
      inProgress: true,
    },
  };

  // Create an array of squares that contain row * columns squares
  for (let rowNumber = 0; rowNumber < rows; rowNumber++) {
    let rowLetter = String.fromCharCode(97 + rowNumber);
    for (let columnNumber = 1; columnNumber < columns + 1; columnNumber++) {
      game.gameData.push({
        name: rowLetter + String(columnNumber),
        mined: false,
        revealed: false,
        marked: false,
        neighbors: findNeighbors(
          { letter: rowLetter, number: columnNumber },
          rows,
          columns
        ),
        neighboringMines: [],
        markedNeighbors: [],
      });
    }
  }

  // Mark specified amount of squares as mined
  layMines(game);

  // For each square, see how many mines are in its neighboring squares
  findNeighboringMines(game);

  return game;
}

function findNeighbors(
  // Find all neighboring squares of a given square, taking the playing field limits into account
  square: { letter: string; number: number },
  maxRow: number,
  maxColumn: number
): string[] {
  const maxRowLetter: string = String.fromCharCode(
    "a".charCodeAt(0) + maxRow - 1
  );
  const neighborLetters: string[] = [];
  neighborLetters.push(square.letter);
  if (square.letter !== maxRowLetter) {
    neighborLetters.push(String.fromCharCode(square.letter.charCodeAt(0) + 1));
  }
  if (square.letter !== "a") {
    neighborLetters.push(String.fromCharCode(square.letter.charCodeAt(0) - 1));
  }
  const neighbors: string[] = [];
  for (let letter of neighborLetters) {
    neighbors.push(letter + square.number);
    if (!(square.number === maxColumn)) {
      neighbors.push(letter + (square.number + 1));
    }
    if (square.number > 1) {
      neighbors.push(letter + (square.number - 1));
    }
  }
  neighbors.splice(neighbors.indexOf(square.letter + square.number), 1);
  return neighbors;
}

function layMines(game: gameState): void {
  // Lay specified amount of mines in random squares of given game
  let minesToLay = game.metaData.mines;
  while (minesToLay > 0) {
    const randomNumber = Math.floor(Math.random() * game.gameData.length);
    if (!game.gameData[randomNumber].mined) {
      game.gameData[randomNumber].mined = true;
      minesToLay--;
    }
  }
}

function findNeighboringMines(game: gameState): void {
  const minedSquares: string[] = [];

  // First, find all mined squares
  game.gameData.map((square) => {
    if (square.mined) {
      minedSquares.push(square.name);
    }
  });

  // Then map over each square and see if its neighbors are included in the mined squares
  game.gameData.map((square) => {
    square.neighbors.map((neighbor) => {
      if (minedSquares.includes(neighbor)) {
        square.neighboringMines.push(neighbor);
      }
    });
  });
}

export default Minesweeper;
