import MineSweeper from "../components/MineSweeper";

export default function Home() {
  return (
    <main>
      <h1 className="text-4xl text-center my-6">Minesweeper</h1>
      <section className="">
        <MineSweeper />
      </section>
    </main>
  );
}
