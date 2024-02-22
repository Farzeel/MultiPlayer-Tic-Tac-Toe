import React, { useEffect, useRef, useState } from "react";
import Square from "./Square";
import "./App.css";

const App = () => {
  const initialArray = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  const [array, setArray] = useState(initialArray);
  const [rowIndex, setRowIndex] = useState(null);
  const [isXturn, setIsXturn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [player1Undo, setPlayer1Undo] = useState(3);
  const [player2Undo, setPlayer2Undo] = useState(3);
  const [showUndo, setShowUndo] = useState(false);
  const [isUndo, setIsUndo] = useState(false);
  const [counter, setCounter] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const handleUndo = () => {
    console.log(array[rowIndex.row][rowIndex.col]);
    setIsUndo(true);
    setShowUndo(false);
    clearInterval(intervalRef.current);
    setCounter(5);
  };

  useEffect(() => {
    console.log("ruming use effect");
    if (counter <= 0) {
      console.log("inside 0");
      setIsXturn(!isXturn);
      setIsPlaying(false);
      setIsUndo(false);
      setShowUndo(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setCounter(5);
    }
    if (
      (isXturn && isUndo && player1Undo <= 3 && player1Undo > 0) ||
      (!isXturn && isUndo && player2Undo <= 3 && player2Undo > 0)
    ) {
      if (array[rowIndex.row][rowIndex.col] == "X") {
        setPlayer1Undo(player1Undo - 1);
        console.log({ player1Undo });
        console.log("X");
        setIsXturn(true);
        setIsPlaying(false);
        setIsUndo(false);
        array[rowIndex.row][rowIndex.col] = null;
      } else if (array[rowIndex.row][rowIndex.col] == "O") {
        console.log("O");
        setIsXturn(false);
        setIsPlaying(false);
        setIsUndo(false);
        array[rowIndex.row][rowIndex.col] = null;
        setPlayer2Undo(player2Undo - 1);
      }
    }
  }, [counter, isUndo]);

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);
  };

  const handleClick = (rowIndx, colIndex) => {
    setShowUndo(true);

    if (array[rowIndx][colIndex] == null) {
      console.log("2nd");
      setArray((prevArray) => {
        const newArray = [...prevArray];
        newArray[rowIndx][colIndex] = isXturn ? "X" : "O";

        return newArray;
      });
      if ((isXturn && player1Undo <= 0) || (!isXturn && player2Undo <= 0)) {
        setIsUndo(false);
        setShowUndo(false);
        setIsXturn(!isXturn);
      }
      setIsPlaying(
        (isXturn && player1Undo > 0) || (!isXturn && player2Undo > 0)
      );

      if ((isXturn && player1Undo > 0) || (!isXturn && player2Undo > 0)) {
        startTimer();
      }
    } else {
      console.log("full");
    }
  };

  return (
    <div className="mainContainer">
      <h1>TIC TAC TOE</h1>

      <h2>{isXturn ? "Player 1" : "Player 2"}</h2>
      <div className="squareWrapper">
        {array.map((arr, index) =>
          arr.map((el, index1) => {
            const row = index;
            const col = index1;

            return (
              <Square
                key={`${index}-${index1}`}
                item={el}
                onClick={
                  isPlaying
                    ? null
                    : () => {
                        handleClick(index, index1);
                        setRowIndex({ row: row, col: col });
                      }
                }
              />
            );
          })
        )}
      </div>

      {showUndo && (
        <>
          <button
            className={`undo ${
              ((isXturn && player1Undo <= 0) ||
                (!isXturn && player2Undo <= 0)) &&
              "disabled"
            }`}
            onClick={handleUndo}
          >
            Undo ({isXturn ? player1Undo : player2Undo} Left)
          </button>
          <span>
            {((isXturn && player1Undo > 0) || (!isXturn && player2Undo > 0)) &&
              counter}
          </span>
        </>
      )}
    </div>
  );
};

export default App;
