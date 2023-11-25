'use client';

import { useReducer } from 'react';
import Square from './Square';

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
  createdAt: Date | null;
  finishedAt: Date | null;
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
  Reveal = 'REVEAL',
  Mark = 'MARK',
  Unmark = 'UNMARK',
  Chord = 'CHORD',
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

const reducer = (state: gameState, action: Action): gameState => {
  if (!state.metaData.inProgress)
    return {
      ...state,
    };
  if (state.metaData.createdAt === null) {
    state.metaData.createdAt = new Date();
  }
  const { type, payload } = action;
  const square = state.gameData.filter((x) => x.name === payload)[0];

  function endGame(result: boolean): void {
    state.metaData.inProgress = false;
    state.metaData.finishedAt = new Date();
    state.metaData.won = result;
  }

  function gameLost(): void {
    endGame(false);
    console.log('BOOM, you lose!');
  }

  function gameWon(): void {
    endGame(true);
    console.log('You win!');
  }

  function checkOffSquare(solvedSquare: string): void {
    // Remove a square from the squares that need to be revealed
    if (state.metaData.revealToWin.includes(solvedSquare)) {
      state.metaData.revealToWin.splice(
        state.metaData.revealToWin.indexOf(solvedSquare),
        1,
      );
    }

    // Check for a win
    if (state.metaData.revealToWin.length === 0) {
      gameWon();
    }
  }

  function findAllSquaresToReveal(rootSquare: square): string[] {
    const squaresToReveal: string[] = [
      ...rootSquare.neighbors,
      rootSquare.name,
    ];
    const squaresToCheck: string[] = [...rootSquare.neighbors];
    const checkedSquares: string[] = [rootSquare.name];

    while (squaresToCheck.length > 0) {
      // Find the square we want to examine
      const square = state.gameData.filter(
        (x) => x.name === squaresToCheck[0],
      )[0];

      if (square.neighboringMines.length === 0) {
        // If it has no neighboring mines, add it to the to-reveal-list
        if (!squaresToReveal.includes(square.name)) {
          squaresToReveal.push(square.name);
        }

        // Add all of its neighbors to the to-reveal-list
        square.neighbors.map((x) => {
          if (!squaresToReveal.includes(x)) {
            squaresToReveal.push(x);
          }

          // Also add all of its neighbors to the to-check-list
          if (!checkedSquares.includes(x)) {
            if (!squaresToCheck.includes(x)) {
              squaresToCheck.push(x);
            }
          }
        });
      }

      squaresToCheck.shift();
      checkedSquares.push(square.name);
    }
    return squaresToReveal;
  }

  function revealSquare(square: square): void {
    if (square.mined === true) {
      square.revealed = true;
      gameLost();
    }

    if (square.neighboringMines.length === 0) {
      const allSquaresToReveal: string[] = findAllSquaresToReveal(square);

      // Iterate over ALL squares and see if they need to be revealed
      state.gameData.map((x) => {
        if (allSquaresToReveal.includes(x.name)) {
          x.revealed = true;
          checkOffSquare(x.name);
        }
      });
    } else {
      square.revealed = true;
      checkOffSquare(square.name);
    }
  }

  switch (type) {
    case ActionKind.Reveal:
      revealSquare(square);

      return {
        ...state,
      };

    case ActionKind.Mark:
      square.marked = true;
      square.neighbors.map((x) => {
        const squareToUpdate = state.gameData.filter((sq) => sq.name === x)[0];
        if (!squareToUpdate.markedNeighbors.includes(square.name)) {
          squareToUpdate.markedNeighbors.push(square.name);
        }
      });

      return {
        ...state,
      };

    case ActionKind.Unmark:
      square.marked = false;
      square.neighbors.map((x) => {
        const squareToUpdate = state.gameData.filter((sq) => sq.name === x)[0];
        if (squareToUpdate.markedNeighbors.includes(square.name)) {
          squareToUpdate.markedNeighbors.splice(
            squareToUpdate.markedNeighbors.indexOf(square.name),
            1,
          );
        }
      });

      return {
        ...state,
      };

    case ActionKind.Chord:
      if (square.markedNeighbors.length === square.neighboringMines.length) {
        square.neighbors.map((neighborSquareName) => {
          const neighborSquare = state.gameData.filter(
            (x) => x.name === neighborSquareName,
          )[0];
          if (!neighborSquare.marked && !neighborSquare.revealed) {
            revealSquare(neighborSquare);
          }
        });
      }

      return {
        ...state,
      };
    default:
      throw new Error('Unknown action type!');
  }
};

function Minesweeper({ rows, columns, mines }: gameProps) {
  const initialState: gameState = createGame({
    rows: rows,
    columns: columns,
    mines: mines,
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  const revealSquareAction: Action = { type: ActionKind.Reveal };
  const markSquareAction: Action = { type: ActionKind.Mark };
  const ChordAction: Action = { type: ActionKind.Chord };

  const renderedGame = [];
  for (let row = 0; state.metaData.rows > row; row++) {
    renderedGame.push(
      state.gameData.slice(
        state.metaData.columns * row,
        state.metaData.columns * row + state.metaData.columns,
      ),
    );
  }

  return (
    <div className="flex h-full select-none flex-col items-center justify-center bg-slate-900 lg:py-8">
      {renderedGame.map((row, index) => {
        return (
          <div key={index} className="flex">
            {row.map((square) => {
              return (
                <Square
                  key={square.name}
                  name={square.name}
                  revealed={square.revealed}
                  marked={square.marked}
                  neighboringMines={square.neighboringMines}
                  mined={square.mined}
                  dispatch={dispatch}
                />
              );
            })}
          </div>
        );
      })}
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
      createdAt: null,
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
          columns,
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
  maxColumn: number,
): string[] {
  const maxRowLetter: string = String.fromCharCode(
    'a'.charCodeAt(0) + maxRow - 1,
  );
  const neighborLetters: string[] = [];
  neighborLetters.push(square.letter);
  if (square.letter !== maxRowLetter) {
    neighborLetters.push(String.fromCharCode(square.letter.charCodeAt(0) + 1));
  }
  if (square.letter !== 'a') {
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
