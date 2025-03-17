import { MatrixRain } from "@/components/matrix-rain";
import { GameOfLife } from "@/components/game-of-life";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-0 bg-matrix-black">
      <MatrixRain />
      <div className="z-10 w-full max-w-full"> {/* Increase to full width */}
        <header className="bg-black border-b border-green-900 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-green-400 font-bold text-xl">
              <span className="text-green-500">MATRIX</span> | GAME OF LIFE
            </div>
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <a href="#" className="text-green-400 hover:text-green-300">
                    ABOUT
                  </a>
                </li>
                <li>
                  <a href="#" className="text-green-400 hover:text-green-300">
                    PRODUCTS
                  </a>
                </li>
                <li>
                  <a href="#" className="text-green-400 hover:text-green-300">
                    COMMUNITY
                  </a>
                </li>
                <li>
                  <a href="#" className="text-green-400 hover:text-green-300">
                    CONTACT
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <div className="w-full relative">
          <GameOfLife />
        </div>

        <div className="mt-4 text-sm text-green-600 max-w-7xl mx-auto px-4">
          <p>
            A cellular automaton is a collection of cells on a grid that evolves in a series of steps,
            following a set of rules based on the states of neighboring cells.
          </p>
          <p className="mt-2">
            In this visualization, we are using Wolfram&apos;s cellular automaton as an input to Conway&apos;s Game of Life.
            Cells at the base of the simulation are populated with values from a row of cellular automata cells.
          </p>
          <p className="mt-2">
            You can use the control panel to edit the cellular automaton rules and choose from various presets.
            The &apos;Elementary&apos; mode uses only binary states of neighboring cells,
            while the &apos;Totalistic&apos; uses the total value of neighboring cells.
          </p>
        </div>
      </div>

      <footer className="mt-8 bg-black border-t border-green-900 p-4 text-green-700 text-sm w-full">
        <div className="max-w-7xl mx-auto">
          <p>
            A visualization of Wolfram&apos;s cellular automaton as an input to Conway&apos;s Game of Life.
          </p>
          <p className="mt-2">
            <a href="https://mathworld.wolfram.com/CellularAutomaton.html"
               className="text-green-500 hover:underline"
               target="_blank"
               rel="noopener noreferrer">
              Learn more about cellular automata
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
