import PlayingField from "@/components/PlayingField";

import { createGame } from "@/lib/create-game";

export default function Home() {
  const rows = 19;
  const columns = 26;
  const mines = 99;
  const game = createGame({ rows: rows, columns: columns, mines: mines });
  console.log(game[0]);

  return (
    <main>
      <h1 className="text-4xl text-center">Minesweeper</h1>
      <section>
        <PlayingField game={game} />
      </section>
    </main>
  );
}
