import MineSweeper from "../components/MineSweeper";

export default function Home() {
  return (
    <main>
      <h1 className="my-6 text-center text-4xl">Minesweeper</h1>
      <section>
        <MineSweeper rows={10} columns={16} mines={29} />
      </section>
    </main>
  );
}
