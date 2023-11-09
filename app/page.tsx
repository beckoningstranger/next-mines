// 26 width * 19 height

export default function Home() {
  const fieldWidth = 26;
  const fieldHeight = 19;
  const numberOfMines = 99;

  return <main>Home</main>;
}

interface square {
  name: string;
  mined: boolean;
  revealed: boolean;
  marked: boolean;
  neighbors: square[];
}

interface gameProps {
  rows: number;
  columns: number;
  mines: number;
}

function createGame({ rows, columns, mines }: gameProps) {
  // Create an array of arrays of rows that each contain as many square objects as there are columns
  let game = [];
  for (let rowNumber = 0; rowNumber < rows; rowNumber++) {
    let row: square[] = [];
    for (let columnNumber = 0; columnNumber < columns; columnNumber++) {
      row.push({
        name: String.fromCharCode(97 + rowNumber) + String(columnNumber),
        mined: false,
        revealed: false,
        marked: false,
        neighbors: [],
      });
    }
    game.push(row);
  }

  console.log(game);
}
