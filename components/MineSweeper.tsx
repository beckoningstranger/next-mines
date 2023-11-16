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
  Unmark = "UNMARK",
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
  const rows = 12;
  const columns = 12;
  const mines = 30;
  const initialState: gameState = createGame({
    rows: rows,
    columns: columns,
    mines: mines,
  });

  const reducer = (state: gameState, action: Action): gameState => {
    const { type, payload } = action;
    const square = state.gameData.filter((x) => x.name === payload)[0];

    function checkOffSquare(solvedSquare: string): void {
      // Remove a square from the squares that need to be revealed
      if (state.metaData.revealToWin.includes(solvedSquare)) {
        state.metaData.revealToWin.splice(
          state.metaData.revealToWin.indexOf(solvedSquare),
          1
        );
      }

      // Check for a win
      if (state.metaData.revealToWin.length === 0) {
        // TO DO: TRIGGER WIN HERE
        console.log("You win!");
        state.metaData.won = true;
      }
    }

    switch (type) {
      case ActionKind.Reveal:
        if (square.mined === true) {
          console.log("BOOM, you lose!");
          // TO DO: TRIGGER LOSS HERE
          state.metaData.won = false;
          return {
            ...state,
          };
        } else {
          square.revealed = true;
          checkOffSquare(square.name);
          // If square does not have any neighboring mines, reveal all surrounding squares
          if (square.neighboringMines.length === 0) {
            square.neighbors.map((neighborSquareName) => {
              const neighborSquare = state.gameData.filter(
                (x) => x.name === neighborSquareName
              )[0];
              neighborSquare.revealed = true;
              // Remove that neighboring square from the squares that need to be revealed
              checkOffSquare(neighborSquare.name);
            });
          }
        }

        // Check for a win
        if (state.metaData.revealToWin.length === 0) {
          // TO DO: TRIGGER WIN HERE
          console.log("You win!");
          state.metaData.won = true;
        }

        return {
          ...state,
        };

      case ActionKind.Mark:
        square.marked = true;
        square.neighbors.map((x) => {
          const squareToUpdate = state.gameData.filter(
            (sq) => sq.name === x
          )[0];
          squareToUpdate.markedNeighbors.push(square.name);
        });

        return {
          ...state,
        };

      case ActionKind.Unmark:
        square.marked = false;
        square.neighbors.map((x) => {
          const squareToUpdate = state.gameData.filter(
            (sq) => sq.name === x
          )[0];
          squareToUpdate.markedNeighbors.splice(
            squareToUpdate.markedNeighbors.indexOf(square.name),
            1
          );
        });

        return {
          ...state,
        };

      case ActionKind.Chord:
        if (square.markedNeighbors.length === square.neighboringMines.length) {
          square.neighbors.map((neighborSquareName) => {
            const neighborSquare = state.gameData.filter(
              (x) => x.name === neighborSquareName
            )[0];
            if (!neighborSquare.marked && !neighborSquare.revealed) {
              neighborSquare.revealed = true;
              if (neighborSquare.mined) {
                console.log("BOOM, you lose!");
                state.metaData.won = false;
                // TO DO: Proper losing behavior
              }
              checkOffSquare(neighborSquare.name);
            }
          });
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

  // const styles = `grid grid-cols-${columns} bg-red-200 select-none justify-items-center m-5 p-6`;
  const styles =
    "grid grid-cols-12 gap-2 bg-red-200 select-none justify-items-center m-5 p-6";
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

  // For each square, see how many mines there are in its neighboring squares
  findNeighboringMines(game);

  // Find the square the players has to reveal to win
  findUnminedSquares(game);

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

function findUnminedSquares(game: gameState): void {
  game.gameData.map((square) => {
    if (!square.mined) {
      game.metaData.revealToWin.push(square.name);
    }
  });
}

export default Minesweeper;
