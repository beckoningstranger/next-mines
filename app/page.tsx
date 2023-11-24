import MineSweeper from '../components/MineSweeper';

export default function Home() {
  return (
    <main>
      <h1 className="my-6 text-center text-4xl">Minesweeper</h1>
      <section>
        <MineSweeper rows={19} columns={26} mines={99} />
      </section>
    </main>
  );
}
