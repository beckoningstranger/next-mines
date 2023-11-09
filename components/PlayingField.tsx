import Square from "@/components/Square";

interface square {
  name: string;
  mined: boolean;
  revealed: boolean;
  marked: boolean;
  neighbors: string[];
  neighboringMines: string[];
}

interface PlayingFieldProps {
  game: square[][];
}

const PlayingField = ({ game }: PlayingFieldProps) => {
  console.log(`[PlayingField rendering]...`);
  return (
    <div className="flex flex-col w-100 bg-amber-200 p-2 m-12">
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
