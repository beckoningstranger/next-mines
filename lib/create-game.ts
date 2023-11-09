interface square {
  name: string;
  mined: boolean;
  revealed: boolean;
  marked: boolean;
  neighbors: string[];
}

interface gameProps {
  rows: number;
  columns: number;
  mines: number;
}

export function createGame({ rows, columns, mines }: gameProps): square[][] {
  // Create an array of arrays of rows that each contain as many square objects as there are columns
  const game: square[][] = [];
  for (let rowNumber = 0; rowNumber < rows; rowNumber++) {
    let row: square[] = [];
    let rowLetter = String.fromCharCode(97 + rowNumber);
    for (let columnNumber = 1; columnNumber < columns + 1; columnNumber++) {
      row.push({
        name: rowLetter + String(columnNumber),
        mined: false,
        revealed: false,
        marked: false,
        neighbors: findNeighbors(
          { letter: rowLetter, number: columnNumber },
          rows,
          columns
        ),
      });
    }
    game.push(row);
  }
  // Mark specified amount of squares as mined
  layMines(game, mines);
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

function layMines(game: square[][], mines: number): void {
  // Lay specified amount of mines in given game array
  const maxRowLetter: string = String.fromCharCode(
    "a".charCodeAt(0) + game.length - 1
  );
  const maxColumnNumber: number = game[0].length;
  while (mines > 0) {
    const randomRow: number = Math.floor(Math.random() * game.length);
    const randomColumn: number = Math.floor(Math.random() * maxColumnNumber);
    if (!game[randomRow][randomColumn].mined) {
      game[randomRow][randomColumn].mined = true;
      mines--;
    }
  }
}
