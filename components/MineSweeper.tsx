import { createGame } from "@/lib/create-game";
import Square from "@/components/Square";

const rows = 19;
const columns = 26;
const mines = 99;
const game = createGame({ rows: rows, columns: columns, mines: mines });
console.log(game[0]);

const PlayingField = () => {
  console.log(`[PlayingField rendering]...`);
  return (
    <div className="flex flex-col w-100 bg-amber-200 p-2 m-12 select-none">
      <div id="playing-field">
        {game.map((row, index) => {
          return (
            <div className="flex flex-row justify-center" key={index}>
              {row.map((square, index) => (
                <Square
                  key={index}
                  name={square.name}
                  mined={square.mined}
                  marked={square.marked}
                  revealed={square.revealed}
                  neighbors={square.neighbors}
                  neighboringMines={square.neighboringMines}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayingField;
