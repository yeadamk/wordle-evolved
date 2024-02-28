import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';


function GridSquare({ value }) {
  return <div className="square">{value}</div>;
}

//function KeyboardSquare({ whichKey, value, onKbClick }) {
function KeyboardSquare({ value, onKbSquareClick }) {
//   return (
//     <button id={id} className="kb-square" onClick={() => onKbClick(id, value)}>
//       {value}
//     </button>
//   );

    //return <div className="kb-square">{value}</div>;


  return (
    <button className="kb-square" onClick={onKbSquareClick}>
      {value}
    </button>
  );

}

function App() {
  const [message, setMessage] = useState("Click To Start Daily Game!");
  const [showBoard, setShowBoard] = useState(false);
  const [currGridSq, setCurrGridSq] = useState(0);
  const [gridSquares, setGridSquares] = useState(Array(30).fill(null));
  const kbInit = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
                  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
                  "RET", 'Z', 'X', 'C', 'V', 'B', 'N', 'M', "DEL"];
  const [kbSquares, setKbSquares] = useState(kbInit);

//   const handleKbClick = (whichSq, whichKey, value) => {
//     // Do whatever you need to do when a keyboard square is clicked
//         setKeyboardValue(keyboardValue === "0" ? "1" : "0");
//   };


  function handleKbClick(val) {
    const nextGridSquares = gridSquares.slice();
    nextGridSquares[currGridSq] = val;
    setCurrGridSq(currGridSq + 1);
    setGridSquares(nextGridSquares);
  }


  return (
    <>
      <div>
        <a href='https://vitejs.dev' target='_blank' s>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Wordle Evolved</h1>
      <div className='card'>
      {!showBoard && (
          <button onClick={() => {
            setMessage("Button Clicked! Daily Game Starting Now!");
            setShowBoard(true);
          }}> {message}</button>
      )}
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
   
   {showBoard && (
      <>
        <div className="board-row">
          <GridSquare value={gridSquares[0]} />
          <GridSquare value={gridSquares[1]} />
          <GridSquare value={gridSquares[2]} />
          <GridSquare value={gridSquares[3]} />
          <GridSquare value={gridSquares[4]} />
        </div>
        <div className="board-row">
          <GridSquare value={gridSquares[5]} />
          <GridSquare value={gridSquares[6]} />
          <GridSquare value={gridSquares[7]} />
          <GridSquare value={gridSquares[8]} />
          <GridSquare value={gridSquares[9]} />
        </div>
        <div className="board-row">
          <GridSquare value={gridSquares[10]} />
          <GridSquare value={gridSquares[11]} />
          <GridSquare value={gridSquares[12]} />
          <GridSquare value={gridSquares[13]} />
          <GridSquare value={gridSquares[14]} />
        </div>
        <div className="board-row">
          <GridSquare value={gridSquares[15]} />
          <GridSquare value={gridSquares[16]} />
          <GridSquare value={gridSquares[17]} />
          <GridSquare value={gridSquares[18]} />
          <GridSquare value={gridSquares[19]} />
        </div>
        <div className="board-row">
          <GridSquare value={gridSquares[20]} />
          <GridSquare value={gridSquares[21]} />
          <GridSquare value={gridSquares[22]} />
          <GridSquare value={gridSquares[23]} />
          <GridSquare value={gridSquares[24]} />
        </div>

        <div className="kb-row">
          <KeyboardSquare value={kbSquares[0]} onKbSquareClick={() => handleKbClick(kbSquares[0])} />
          <KeyboardSquare value={kbSquares[1]} onKbSquareClick={() => handleKbClick(kbSquares[1])} />
          <KeyboardSquare value={kbSquares[2]} onKbSquareClick={() => handleKbClick(kbSquares[2])} />
          <KeyboardSquare value={kbSquares[3]} onKbSquareClick={() => handleKbClick(kbSquares[3])} />
          <KeyboardSquare value={kbSquares[4]} onKbSquareClick={() => handleKbClick(kbSquares[4])} />
          <KeyboardSquare value={kbSquares[5]} onKbSquareClick={() => handleKbClick(kbSquares[5])} />
          <KeyboardSquare value={kbSquares[6]} onKbSquareClick={() => handleKbClick(kbSquares[6])} />
          <KeyboardSquare value={kbSquares[7]} onKbSquareClick={() => handleKbClick(kbSquares[7])} />
          <KeyboardSquare value={kbSquares[8]} onKbSquareClick={() => handleKbClick(kbSquares[8])} />
          <KeyboardSquare value={kbSquares[9]} onKbSquareClick={() => handleKbClick(kbSquares[9])} />
        </div>

        <div className="kb-row">
          <KeyboardSquare value={kbSquares[10]} onKbSquareClick={() => handleKbClick(kbSquares[10])} />
          <KeyboardSquare value={kbSquares[11]} onKbSquareClick={() => handleKbClick(kbSquares[11])} />
          <KeyboardSquare value={kbSquares[12]} onKbSquareClick={() => handleKbClick(kbSquares[12])} />
          <KeyboardSquare value={kbSquares[13]} onKbSquareClick={() => handleKbClick(kbSquares[13])} />
          <KeyboardSquare value={kbSquares[14]} onKbSquareClick={() => handleKbClick(kbSquares[14])} />
          <KeyboardSquare value={kbSquares[15]} onKbSquareClick={() => handleKbClick(kbSquares[15])} />
          <KeyboardSquare value={kbSquares[16]} onKbSquareClick={() => handleKbClick(kbSquares[16])} />
          <KeyboardSquare value={kbSquares[17]} onKbSquareClick={() => handleKbClick(kbSquares[17])} />
          <KeyboardSquare value={kbSquares[18]} onKbSquareClick={() => handleKbClick(kbSquares[18])} />
        </div>

        <div className="kb-row">
          <KeyboardSquare value={kbSquares[19]} onKbSquareClick={() => handleKbClick(kbSquares[19])} />
          <KeyboardSquare value={kbSquares[20]} onKbSquareClick={() => handleKbClick(kbSquares[20])} />
          <KeyboardSquare value={kbSquares[21]} onKbSquareClick={() => handleKbClick(kbSquares[21])} />
          <KeyboardSquare value={kbSquares[22]} onKbSquareClick={() => handleKbClick(kbSquares[22])} />
          <KeyboardSquare value={kbSquares[23]} onKbSquareClick={() => handleKbClick(kbSquares[23])} />
          <KeyboardSquare value={kbSquares[24]} onKbSquareClick={() => handleKbClick(kbSquares[24])} />
          <KeyboardSquare value={kbSquares[25]} onKbSquareClick={() => handleKbClick(kbSquares[25])} />
          <KeyboardSquare value={kbSquares[26]} onKbSquareClick={() => handleKbClick(kbSquares[26])} />
          <KeyboardSquare value={kbSquares[27]} onKbSquareClick={() => handleKbClick(kbSquares[27])} />
        </div>

      </>
  )}
    
   </>


  );
}

export default App;

