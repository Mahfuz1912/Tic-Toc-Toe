import { useState } from "react";

function Square({ value, onSquareClick }) {
  const textColor =
    value === "X" ? "text-red-700" : value === "O" ? "text-green-600" : "";

  return (
    <button
      className={`border-gray-400 border-2 h-16 w-16 text-4xl font-bold bg-white shadow-sm hover:bg-blue-100 transition-all duration-200 ${textColor}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ squares, isNextX, onPlay }) {
  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = `Winner: ${winner}`;
  } else if (squares.every((square) => square !== null)) {
    status = "It's a Draw!";
  } else {
    status = "Next Player: " + (isNextX ? "X" : "O");
  }

  function handleClick(i) {
    if (squares[i] || winner) return;

    const nextSquares = squares.slice();
    nextSquares[i] = isNextX ? "X" : "O";
    onPlay(nextSquares, i); // Pass clicked index
  }

  return (
    <div className="text-center">
      <div className="text-2xl font-semibold text-fuchsia-800 mb-4">{status}</div>
      <div className="grid grid-cols-3 gap-2 justify-center">
        {squares.map((val, idx) => (
          <Square key={idx} value={val} onSquareClick={() => handleClick(idx)} />
        ))}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), moveIndex: null, player: null }
  ]);
  const [isNextX, setIsNext] = useState(true);

  const current = history[history.length - 1].squares;

  function handlePlay(nextSquares, moveIndex) {
    const player = isNextX ? "X" : "O";
    setHistory([
      ...history,
      {
        squares: nextSquares,
        moveIndex: moveIndex,
        player: player
      }
    ]);
    setIsNext(!isNextX);
  }

  function restartGame() {
    setHistory([{ squares: Array(9).fill(null), moveIndex: null, player: null }]);
    setIsNext(true);
  }

  const moves = history.map((step, move) => {
    let description;
    if (move === 0) {
      description = "Game Start";
    } else {
      description = `${step.player} pressed cell ${step.moveIndex + 1} (Move ${move})`;
    }

    return (
      <li key={move}>
        <p
          onClick={() => {
            setHistory(history.slice(0, move + 1));
            setIsNext(move % 2 === 0);
          }}
          className="text-blue-700 text-lg"
        >
          {description}
        </p>
      </li>
    );
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <h1 className="text-6xl font-extrabold text-fuchsia-700 mb-3">Tic Tac Toe</h1>
      <h1 className="text-3xl font-extrabold text-rose-500 mb-8">Make By S.A. Mahfuz</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <Board squares={current} isNextX={isNextX} onPlay={handlePlay} />
          <button
            className="mt-6 bg-red-500 text-white font-semibold py-2 px-4 rounded-xl hover:bg-red-600 transition duration-300 w-full"
            onClick={restartGame}
          >
            Restart Game
          </button>
        </div>

        <div className="w-[270px] bg-amber-300 p-6 rounded-2xl shadow-lg overflow-y-auto max-h-[363px] ">
          <h2 className="text-xl font-bold mb-3 text-gray-800 text-center">Move History</h2>
          <ol className="space-y-2 text-center">{moves}</ol>
        </div>
      </div>
    </div>
  );
}
