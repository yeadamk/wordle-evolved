import './App.css';
import Auth from './Auth';
import { useState } from 'react';

function GridSquare({ value }) {
  return <div className='square'>{value}</div>;
}

function KeyboardSquare({ value, onKbSquareClick }) {
  return (
    <button className='kb-square' onClick={onKbSquareClick}>
      {value}
    </button>
  );
}

function checkStatus(userGuess0, userGuess1, userGuess2, userGuess3, userGuess4, targetWord) {
  const userGuess = userGuess0 + userGuess1 + userGuess2 + userGuess3 + userGuess4;

  const targetLetters = [];
  const status = [];
  let found = false;
  const indTwos = [];

  let occCtr = 0;
  let greenValCtr = 0;
  let yelVal;

  for (let i = 0; i < 5; i++) {
    targetLetters[i] = targetWord[i];
  }

  for (let j = 0; j < 5; j++) {
    if (userGuess[j] == targetWord[j]) {
      status[j] = 2;
    } else {
      for (let k = 0; k < 5; k++) {
        if (userGuess[j] == targetLetters[k]) {
          found = true;
          targetLetters[k] = '0';
          break;
        }
      }

      if (found) {
        status[j] = 1;
      } else {
        status[j] = 0;
      }
    }

    found = false;
  }

  for (let p = 0; p < 5; p++) {
    if (status[p] == 1) {
      occCtr = 0;
      greenValCtr = 0;

      yelVal = userGuess[p];
      for (let q = 0; q < 5; q++) {
        if (yelVal == targetWord[q]) {
          occCtr++;
          if (status[q] == 2) {
            greenValCtr++;
          }
        }
      }

      if (occCtr == greenValCtr) {
        status[p] = 0;
      }
    }
  }

  return status;
}

function checkWinner(colorArr) {
  for (let i = 0; i < 5; i++) {
    if (colorArr[i] != 2) {
      return false;
    }
  }

  return true;
}

function checkValidWord(userGuess0, userGuess1, userGuess2, userGuess3, userGuess4, words) {
  const userGuess = userGuess0 + userGuess1 + userGuess2 + userGuess3 + userGuess4;

  if (words.includes(userGuess)) {
    return true;
  } else {
    return false;
  }
}

function GamePlay() {
  const [message, setMessage] = useState('Click To Start Daily Game!');
  const [showBoard, setShowBoard] = useState(false);
  const [currGridSq, setCurrGridSq] = useState(0);
  const [gridSquares, setGridSquares] = useState(Array(30).fill(null));
  const kbInit = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'RET',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    'DEL',
  ];
  const [kbSquares, setKbSquares] = useState(kbInit);

  //to be replaced with linux.words later? Filtered down of course.
  const wordList = ['BEANS', 'RATIO', 'HELLO', 'WORLD', 'MOUSE', 'ROCKY', 'WATER', 'SUPER', 'HOUSE'];

  const [targetWord, setTargetWord] = useState(() => {
    return wordList[Math.floor(Math.random() * wordList.length)];
  });

  const [userGuess, setUserGuess] = useState('');
  const [restrictType, setRestrictType] = useState(false);
  const [minIndDel, setMinIndDel] = useState(0);
  const [colorArr, setColorArr] = useState(Array(5).fill(null));
  const [numGuesses, setNumGuesses] = useState(0);
  const [playerWon, setPlayerWon] = useState(false);
  const [playerWonOne, setPlayerWonOne] = useState(false);
  const [playerLost, setPlayerLost] = useState(false);
  const [displayInvalid, setDisplayInvalid] = useState(false);

  function handleKbClick(val) {
    const nextGridSquares = gridSquares.slice();

    if (val == 'DEL') {
      if (currGridSq > 0 && currGridSq > minIndDel) {
        nextGridSquares[currGridSq - 1] = null;
        setCurrGridSq(currGridSq - 1);
        setRestrictType(false);
        setDisplayInvalid(false);
      }
    } else if (val == 'RET') {
      if (currGridSq % 5 == 0 && currGridSq != 0 && !playerWon && !playerWonOne && !playerLost) {
        if (
          checkValidWord(
            nextGridSquares[currGridSq - 5],
            nextGridSquares[currGridSq - 4],
            nextGridSquares[currGridSq - 3],
            nextGridSquares[currGridSq - 2],
            nextGridSquares[currGridSq - 1],
            wordList,
          )
        ) {
          setColorArr(
            checkStatus(
              nextGridSquares[currGridSq - 5],
              nextGridSquares[currGridSq - 4],
              nextGridSquares[currGridSq - 3],
              nextGridSquares[currGridSq - 2],
              nextGridSquares[currGridSq - 1],
              targetWord,
            ),
          );

          const newColorArr = checkStatus(...nextGridSquares.slice(currGridSq - 5, currGridSq), targetWord);
          setColorArr(newColorArr);

          for (let i = 0; i < 5; i++) {
            if (newColorArr[i] == 0) {
              nextGridSquares[currGridSq + i - 5] = (
                <div className='boardsquare' style={{ backgroundColor: 'grey' }}>
                  {nextGridSquares[currGridSq + i - 5]}
                </div>
              );
            } else if (newColorArr[i] == 1) {
              nextGridSquares[currGridSq + i - 5] = (
                <div className='boardsquare' style={{ backgroundColor: 'yellow' }}>
                  {nextGridSquares[currGridSq + i - 5]}
                </div>
              );
            } else if (newColorArr[i] == 2) {
              nextGridSquares[currGridSq + i - 5] = (
                <div className='boardsquare' style={{ backgroundColor: 'green' }}>
                  {nextGridSquares[currGridSq + i - 5]}
                </div>
              );
            } else {
            }
          }

          setNumGuesses(numGuesses + 1);

          if (checkWinner(newColorArr) && numGuesses == 0) {
            setPlayerWonOne(true);
          } else if (checkWinner(newColorArr)) {
            setPlayerWon(true);
          }

          if (!checkWinner(newColorArr) && currGridSq == 30) {
            setPlayerLost(true);
          }

          setRestrictType(false);
          setMinIndDel(currGridSq);
          setDisplayInvalid(false);
        } else {
          setDisplayInvalid(true);
        }
      }
    } else {
      if (!restrictType && !playerWon && !playerWonOne && !playerLost) {
        nextGridSquares[currGridSq] = val;
        setCurrGridSq(currGridSq + 1);

        if ((currGridSq + 1) % 5 == 0) {
          setRestrictType(true);
        }
        setDisplayInvalid(false);
      }
    }

    setGridSquares(nextGridSquares);
  }

  return (
    <>
      {/* <div>
        <a href='https://vitejs.dev' target='_blank' s>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div> */}
      <h1>Wordle Evolved</h1>
      <div className='card'>
        {!showBoard && (
          <button
            onClick={() => {
              setMessage('Button Clicked! Daily Game Starting Now!');
              setShowBoard(true);
            }}>
            {' '}
            {message}
          </button>
        )}
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>

      {showBoard && (
        <>
          {displayInvalid && (
            <>
              <div>
                <p> Not a valid word! </p>
              </div>
            </>
          )}

          {playerWonOne && (
            <>
              <div>
                <p> You won! It took {numGuesses} guess! </p>
              </div>
            </>
          )}

          {playerWon && (
            <>
              <div>
                <p> You won! It took {numGuesses} guesses! </p>
              </div>
            </>
          )}

          {playerLost && (
            <>
              <div>
                <p> Game over! The word was {targetWord}. </p>
              </div>
            </>
          )}

          <div className='board-row'>
            <GridSquare value={gridSquares[0]} />
            <GridSquare value={gridSquares[1]} />
            <GridSquare value={gridSquares[2]} />
            <GridSquare value={gridSquares[3]} />
            <GridSquare value={gridSquares[4]} />
          </div>
          <div className='board-row'>
            <GridSquare value={gridSquares[5]} />
            <GridSquare value={gridSquares[6]} />
            <GridSquare value={gridSquares[7]} />
            <GridSquare value={gridSquares[8]} />
            <GridSquare value={gridSquares[9]} />
          </div>
          <div className='board-row'>
            <GridSquare value={gridSquares[10]} />
            <GridSquare value={gridSquares[11]} />
            <GridSquare value={gridSquares[12]} />
            <GridSquare value={gridSquares[13]} />
            <GridSquare value={gridSquares[14]} />
          </div>
          <div className='board-row'>
            <GridSquare value={gridSquares[15]} />
            <GridSquare value={gridSquares[16]} />
            <GridSquare value={gridSquares[17]} />
            <GridSquare value={gridSquares[18]} />
            <GridSquare value={gridSquares[19]} />
          </div>
          <div className='board-row'>
            <GridSquare value={gridSquares[20]} />
            <GridSquare value={gridSquares[21]} />
            <GridSquare value={gridSquares[22]} />
            <GridSquare value={gridSquares[23]} />
            <GridSquare value={gridSquares[24]} />
          </div>
          <div className='board-row'>
            <GridSquare value={gridSquares[25]} />
            <GridSquare value={gridSquares[26]} />
            <GridSquare value={gridSquares[27]} />
            <GridSquare value={gridSquares[28]} />
            <GridSquare value={gridSquares[29]} />
          </div>

          <div className='kb-row'>
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

          <div className='kb-row'>
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

          <div className='kb-row'>
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

export default GamePlay;