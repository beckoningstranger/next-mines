import MineSweeper from "../components/MineSweeper";

export default function Home() {
  return (
    <main>
      <h1 className="text-4xl text-center">Minesweeper</h1>
      <section>
        <MineSweeper />
      </section>
    </main>
  );
}
