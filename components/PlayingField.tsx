import Square from "@/components/Square";

interface PlayingFieldProps {
  game: square[][];
}

const PlayingField = ({ game }: PlayingFieldProps) => {
  return (
    <div className="flex justify-between w-100 bg-amber-200 p-2 m-12">
      {game.map((row, index) => {
        return (
          <div key={index}>
            {row.map((square, index) => (
              <Square
                key={index}
                name={square.name}
                mined={square.mined}
                marked={square.marked}
                revealed={square.revealed}
                neighbors={square.neighbors}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default PlayingField;
