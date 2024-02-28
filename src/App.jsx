import React, { useEffect, useRef, useState } from "react";
import Square from "./Square";
import "./App.css";

const App = () => {
  const initialArray = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  let counterValue = 2
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

  const [array, setArray] = useState(initialArray);
  const [rowIndex, setRowIndex] = useState(null);
  const [isXturn, setIsXturn] = useState(true);
  const [isgameOver, setIsGameOver] = useState(false);
  const [player1Undo, setPlayer1Undo] = useState(3);
  const [player2Undo, setPlayer2Undo] = useState(3);
  const [showUndo, setShowUndo] = useState(false);
  const [isUndo, setIsUndo] = useState(false);
  const [counter, setCounter] = useState(counterValue);
  const [isPlaying, setIsPlaying] = useState(false);
  const [winnerName , setWinnerName] = useState("")
  const intervalRef = useRef(null);
  const winningLineref = useRef(null)



  const checkWinner =(board)=>{
    let line;
   for (let combo of winningCombos){
    const [a,b,c] = combo
    if(board[a] && board[a]==board[b] && board[a]==board[c]){
      line=combo
   
      if(line[0]==0 && line[1]==1 && line[2]==2){
       winningLineref.current.classList.add("horizental1")
        winningLineref.current.style.backgroundColor=board[a]=="X"?"green":"purple"

       
      }else if(line[0]==3 && line[1]==4 && line[2]==5){
        winningLineref.current.classList.add("horizental2")
        winningLineref.current.style.backgroundColor=board[a]=="X"?"green":"purple"
      }
      else if(line[0]==6 && line[1]==7 && line[2]==8){
        winningLineref.current.classList.add("horizental3")
        winningLineref.current.style.backgroundColor=board[a]=="X"?"green":"purple"
      }
      else if(line[0]==0 && line[1]==4 && line[2]==8){
        winningLineref.current.classList.add("horizental2")
        winningLineref.current.style.transform = "rotate(45deg)"
        winningLineref.current.style.backgroundColor=board[a]=="X"?"green":"purple"
      }
      else if(line[0]==2 && line[1]==4 && line[2]==6){
        winningLineref.current.classList.add("horizental2")
        winningLineref.current.style.transform = "rotate(135deg)"
        winningLineref.current.style.backgroundColor=board[a]=="X"?"green":"purple"
      }
      else if(line[0]==0 && line[1]==3 && line[2]==6){
        winningLineref.current.classList.add("vertical1")
        winningLineref.current.style.backgroundColor=board[a]=="X"?"green":"purple"
      }
      else if(line[0]==1 && line[1]==4 && line[2]==7){
        winningLineref.current.classList.add("vertical2")
        winningLineref.current.style.backgroundColor=board[a]=="X"?"green":"purple"
      }
      else if(line[0]==2 && line[1]==5 && line[2]==8){
        winningLineref.current.classList.add("vertical3")
        winningLineref.current.style.backgroundColor=board[a]=="X"?"green":"purple"
      }
      return board[a]
    }
   
   }
   return null
  }

  const handleUndo = () => {
    console.log(array[rowIndex.row][rowIndex.col]);
    setIsUndo(true);
    setShowUndo(false);
    clearInterval(intervalRef.current);
    setCounter(counterValue);
  };

  useEffect(() => {
    console.log("running use effect");
    if (counter <= 0) {
      console.log("inside 0");
      setIsXturn(!isXturn);
      setIsPlaying(false);
      setIsUndo(false);
      setShowUndo(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setCounter(counterValue);
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
    if (!isgameOver) {
      setShowUndo(true);
  
      if (array[rowIndx][colIndex] == null) {
        console.log("2nd");
        setArray((prevArray) => {
          const newArray = [...prevArray];
          newArray[rowIndx][colIndex] = isXturn ? "X" : "O";
          let winner =checkWinner(newArray.flat())
          console.log("Running Second")
          if(winner){
            setIsGameOver(true)
            clearInterval(intervalRef.current);
            setIsPlaying(false)
            setShowUndo(false);
            setWinnerName(winner)
            
          }
          else if (newArray.flat().every(square => square)) {
            // If all squares are filled and no winner, it's a draw
            setIsGameOver(true);
            clearInterval(intervalRef.current);
            setIsPlaying(false);
            console.log({isPlaying} , "inside setArray")
            setShowUndo(false);
            setWinnerName(""); // No winner in a draw
            
          }
        
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
    }

    const handlePlayAgian=()=>{
      setArray(initialArray)
      setIsGameOver(false)
      setWinnerName("")
    }

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
                  (isPlaying && !isgameOver)
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
      <div ref={winningLineref} className="winningLine"></div>

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
      {isgameOver && <><h1>{winnerName?`player ${winnerName} Wins`:"Its a Darw"}</h1></>}
      {isgameOver&& <><button onClick={handlePlayAgian}>Play Again</button></>}
    </div>
  );
};

export default App;
