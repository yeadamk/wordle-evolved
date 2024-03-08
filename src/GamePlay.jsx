import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function GridSquare({ value }) {
  return <div className='square'>{value}</div>;
}

function KeyboardSquare({ value, color, onKbSquareClick }) {
  return (
    <button className='kb-square' style={{ backgroundColor: color }} onClick={onKbSquareClick}>
      {value}
    </button>
  );
}



function checkStatus(userGuess, targetWord) {

    const wordLength = userGuess.length
    const lettersDict = new Map()
    let status = []



    for (let j = 0; j < wordLength; j++) {

        if (lettersDict.has(targetWord[j])) {
            lettersDict.set(targetWord[j], lettersDict.get(targetWord[j]) + 1)
        } else {
            lettersDict.set(targetWord[j], 1)
        }
    }
    //   console.log("LettersDict, then userGuess")
    //   console.log(lettersDict)
    //   console.log(userGuess)

    // console.log(" ")

    for (let j = 0; j < wordLength; j++) {
        //  console.log("LETTER " + j)
        if (userGuess[j] == targetWord[j]) {
            //  console.log(2)
            status.push(2)
            lettersDict.set(targetWord[j], lettersDict.get(targetWord[j]) - 1)
        }
        else {
            //    console.log(0)
            status.push(0)
        }
    }

    //    console.log(status)
    //  console.log(lettersDict)
    for (let j = 0; j < wordLength; j++) {
        if (status[j] == 0 && lettersDict.has(userGuess[j]) && lettersDict.get(userGuess[j]) > 0) {
            status[j] = 1
            lettersDict.set(userGuess[j], lettersDict.get(userGuess[j]) - 1)
        }
    }
    //  console.log(status)
    //    console.log(lettersDict)
    return status;
}
function checkWinner(colorArr) {
    for (let i = 0; i < colorArr.length; i++) {
        if (colorArr[i] != 2) {
            return false;
        }
    }

    return true;
}

function checkValidWord(userGuess, words) {
    if (words.includes(userGuess)) {
        return true;
    } else {
        return false;
    }
}

function generateWord(words, length, letterRestrictions, specificRequirements) {

    let validWords = []
    let valid = true

    if (letterRestrictions == null) {
        letterRestrictions = []
    }

    if (specificRequirements == null) {
        specificRequirements = []
        for (let i = 0; i < length; i++) {
            specificRequirements.push("")
        }
    }

    for (let i = 0; i < words.length; i++) {

        let word = words[i]
        if (word.length != length) {
            continue
        }


        valid = true
        for (let j = 0; j < word.length; j++) {

            if (word[j] in letterRestrictions) {

                valid = false;
                break;
                // check for '~letter', then invalidates word if it has that letter at index i
            } else if (specificRequirements[j].length > 1 && specificRequirements[j][1] == word[j]) {

                valid = false;
                break;
            } else if (specificRequirements[j].length == 1 && specificRequirements[j] != word[j]) {

                valid = false;
                break;

            }
        }

        if (valid == true) {
            validWords.push(word)
        }
    }

    return validWords[Math.floor(Math.random() * validWords.length)]
}

function GamePlay({ userId, userName }) {

    const wordList = ["hello", "apple", "genes", "races", "horse", "magic", "happy", "lapse", "horrid", "george",
        "flower", "quests", "likely", "second", "outcry", "nobody", "a", "ab", "abc", "abcd", "abcde", "abcdef",
        "abcdefg", "abcdefgh", "abcdefghi", "abcdefghij", "abcdefghijk", "abcdefghijkl", "abcdefghijklm"]
    const wordLength = 5
    const maxGuesses = 6
    const letterRestrictions = null
    const specificRequirements = null

    const [message, setMessage] = useState('Click To Start Daily Game!');
    const [showBoard, setShowBoard] = useState(false);
    const [currGridSq, setCurrGridSq] = useState(0);
    const [gridSquares, setGridSquares] = useState(Array(wordLength).fill(null));


    let gridRows = new Map()

    for (let i = 0; i < maxGuesses; i++) {

        gridRows.set(i, Array(wordLength).fill(

            <div className='boardsquare' style={{ backgroundColor: 'white' }}>
                {null}
            </div>

        ))
    }
    // Hack-y solution to making gridRows a component causing 'too many re-renders'
    const [gridRowsCopy, setGridRowsCopy] = useState(gridRows)

    const kbInit = [
      { value: 'Q', color: 'white' },
      { value: 'W', color: 'white' },
      { value: 'E', color: 'white' },
      { value: 'R', color: 'white' },
      { value: 'T', color: 'white' },
      { value: 'Y', color: 'white' },
      { value: 'U', color: 'white' },
      { value: 'I', color: 'white' },
      { value: 'O', color: 'white' },
      { value: 'P', color: 'white' },
      { value: 'A', color: 'white' },
      { value: 'S', color: 'white' },
      { value: 'D', color: 'white' },
      { value: 'F', color: 'white' },
      { value: 'G', color: 'white' },
      { value: 'H', color: 'white' },
      { value: 'J', color: 'white' },
      { value: 'K', color: 'white' },
      { value: 'L', color: 'white' },
      { value: 'RET', color: 'white' },
      { value: 'Z', color: 'white' },
      { value: 'X', color: 'white' },
      { value: 'C', color: 'white' },
      { value: 'V', color: 'white' },
      { value: 'B', color: 'white' },
      { value: 'N', color: 'white' },
      { value: 'M', color: 'white' },
      { value: 'DEL', color: 'white' },
    ];
    const kbInitLettersOnly = [
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

    const [kbSquares, setKbSquares] = useState(kbInit)
    const [userGuesses, setUserGuesses] = useState([]);
    const [guessColors, setGuessColors] = useState([]);

    const [targetWord, setTargetWord] = useState(generateWord(wordList, wordLength,
        letterRestrictions, specificRequirements));

    const [restrictType, setRestrictType] = useState(false);
    let [colorArr, setColorArr] = useState(Array(wordLength).fill(null));
    let [numGuesses, setNumGuesses] = useState(0);
    const [playerWon, setPlayerWon] = useState(false);
    const [playerWonOne, setPlayerWonOne] = useState(false);
    const [playerLost, setPlayerLost] = useState(false);
    const [displayInvalid, setDisplayInvalid] = useState(false);

    function extractChildren(oldSquares) {
        const squaresCopy = []
        for (let i = 0; i < oldSquares.length; i++) {
            squaresCopy.push(oldSquares[i].props.children)
        }
        return squaresCopy;
    }

    function handleKbClick(kbButtonSquare) {
        const nextGridSquares = gridSquares;
        const nextKbSquares = kbSquares;

        if (kbButtonSquare.value == 'DEL') {
            if (currGridSq > 0) {
                nextGridSquares[currGridSq - 1] = null;
                setCurrGridSq(currGridSq - 1);
                setRestrictType(false);
                setDisplayInvalid(false);
            }
        } else if (kbButtonSquare.value == 'RET') {

            if (currGridSq % word == 0 && currGridSq != 0 && !playerWon && !playerWonOne && !playerLost) {

                const guess = nextGridSquares.toString().replaceAll(",", "").toLowerCase(); 

                if (checkValidWord(guess, targetWord)) {

                    const newColorArr = checkStatus(guess, targetWord);
                    setColorArr(newColorArr);
                    setUserGuesses([...userGuesses, guess]);
                    setGuessColors([...guessColors, newColorArr]);

                    for (let i = 0; i < 5; i++) {
                        if (newColorArr[i] == 0) {
                            nextGridSquares[i] = (
                                <div className='GridSquare' style={{ backgroundColor: 'grey' }}>
                                    {nextGridSquares[i]}
                                </div>
                            );

                            if (nextKbSquares[kbInitLettersOnly.indexOf(gridSquares[i])].color === 'white') {
                                nextKbSquares[kbInitLettersOnly.indexOf(gridSquares[i])] = {
                                    ...nextKbSquares[kbInitLettersOnly.indexOf(gridSquares[i])],
                                    color: 'grey'
                                };
                             }

                        } else if (newColorArr[i] == 1) {

                            nextGridSquares[i] = (
                                <div className='GridSquare' style={{ backgroundColor: 'yellow' }}>
                                    {nextGridSquares[i]}
                                </div>
                            );

                            if (nextKbSquares[kbInitLettersOnly.indexOf(gridSquares[i])].color !== 'green') {
                                nextKbSquares[kbInitLettersOnly.indexOf(gridSquares[i])] = {
                                    ...nextKbSquares[kbInitLettersOnly.indexOf(gridSquares[i])],
                                    color: 'yellow'
                                };
                            }

                        } else if (newColorArr[i] == 2) {
                            nextGridSquares[i] = (
                                <div className='GridSquare' style={{ backgroundColor: 'green' }}>
                                    {nextGridSquares[i]}
                                </div>
                            );

                            nextKbSquares[kbInitLettersOnly.indexOf(gridSquares[i])] = {
                                ...nextKbSquares[kbInitLettersOnly.indexOf(gridSquares[i])],
                                color: 'green'
                            };
                        } else {
                        }
                    }

                setKbSquares(nextKbSquares);

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
                setDisplayInvalid(false);

                } else {
                    setDisplayInvalid(true);
                }
            }
        } else {
            if (!restrictType && !playerWon && !playerWonOne && !playerLost) {

                nextGridSquares[currGridSq] = kbButtonSquare.value;
                setCurrGridSq(currGridSq + 1);

                if ((currGridSq + 1) % wordLength == 0) {
                    setRestrictType(true);
                }
                setDisplayInvalid(false);
            }
        }

        setGridSquares(nextGridSquares);
        gridRows.set(numGuesses, nextGridSquares);
        setGridRowsCopy(gridRows)
    }

    useEffect(() => {
        const reformattedUserGuesses = { ...userGuesses };
        const reformattedColors = { ...guessColors };
        const history = {
            guesses: reformattedUserGuesses,
            colors: reformattedColors,
            targetWord: targetWord,
            playerWon: playerWon,
            uid: userId,
        };
        if (playerWon || playerLost) {
            console.log('hello world');
            (async () => {
                try {
                    const response = await axios.post('http://localhost:4000/api/addhistory', history);
                    console.log(response);
                } catch (e) {
                    console.log(e);
                }
            })();
        }
    }, [playerWon, playerLost]);

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

      {userId ? (
        <>
          <h1>Welcome {userName}!!!</h1>
          <h1>Wordle Evolved</h1>
          <div className='card'></div>
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
        </>
      ) : (
        <>
          <h1>PLEASE SIGN IN</h1>
          <Link to='/auth'>
            <button>SIGN IN</button>
          </Link>
        </>
      )}

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

           { 

            (() => {
                //hack to work around the fact that gridRows is not a component
                gridRows = gridRowsCopy
                let rows = []
                for (let i = 0; i < maxGuesses; i++) {
                    rows.push(
                        <div className='board-row' key={i}>
                            {(() => {
                                let row = []
                                for (let j = 0; j < wordLength; j++) {
                                    row.push(<GridSquare value={gridRows.get(i)[j]} />)
                                }
                                return row
                            })()}
                        </div>
                    )
                }
                return rows
            })()
           }




          <div className='kb-row'>
            <KeyboardSquare value={kbSquares[0].value} color={kbSquares[0].color} onKbSquareClick={() => handleKbClick(kbSquares[0])} />
            <KeyboardSquare value={kbSquares[1].value} color={kbSquares[1].color} onKbSquareClick={() => handleKbClick(kbSquares[1])} />
            <KeyboardSquare value={kbSquares[2].value} color={kbSquares[2].color} onKbSquareClick={() => handleKbClick(kbSquares[2])} />
            <KeyboardSquare value={kbSquares[3].value} color={kbSquares[3].color} onKbSquareClick={() => handleKbClick(kbSquares[3])} />
            <KeyboardSquare value={kbSquares[4].value} color={kbSquares[4].color} onKbSquareClick={() => handleKbClick(kbSquares[4])} />
            <KeyboardSquare value={kbSquares[5].value} color={kbSquares[5].color} onKbSquareClick={() => handleKbClick(kbSquares[5])} />
            <KeyboardSquare value={kbSquares[6].value} color={kbSquares[6].color} onKbSquareClick={() => handleKbClick(kbSquares[6])} />
            <KeyboardSquare value={kbSquares[7].value} color={kbSquares[7].color} onKbSquareClick={() => handleKbClick(kbSquares[7])} />
            <KeyboardSquare value={kbSquares[8].value} color={kbSquares[8].color} onKbSquareClick={() => handleKbClick(kbSquares[8])} />
            <KeyboardSquare value={kbSquares[9].value} color={kbSquares[9].color} onKbSquareClick={() => handleKbClick(kbSquares[9])} />
          </div>

          <div className='kb-row'>
            <KeyboardSquare value={kbSquares[10].value} color={kbSquares[10].color} onKbSquareClick={() => handleKbClick(kbSquares[10])} />
            <KeyboardSquare value={kbSquares[11].value} color={kbSquares[11].color} onKbSquareClick={() => handleKbClick(kbSquares[11])} />
            <KeyboardSquare value={kbSquares[12].value} color={kbSquares[12].color} onKbSquareClick={() => handleKbClick(kbSquares[12])} />
            <KeyboardSquare value={kbSquares[13].value} color={kbSquares[13].color} onKbSquareClick={() => handleKbClick(kbSquares[13])} />
            <KeyboardSquare value={kbSquares[14].value} color={kbSquares[14].color} onKbSquareClick={() => handleKbClick(kbSquares[14])} />
            <KeyboardSquare value={kbSquares[15].value} color={kbSquares[15].color} onKbSquareClick={() => handleKbClick(kbSquares[15])} />
            <KeyboardSquare value={kbSquares[16].value} color={kbSquares[16].color} onKbSquareClick={() => handleKbClick(kbSquares[16])} />
            <KeyboardSquare value={kbSquares[17].value} color={kbSquares[17].color} onKbSquareClick={() => handleKbClick(kbSquares[17])} />
            <KeyboardSquare value={kbSquares[18].value} color={kbSquares[18].color} onKbSquareClick={() => handleKbClick(kbSquares[18])} />
          </div>

          <div className='kb-row'>
            <KeyboardSquare value={kbSquares[19].value} color={kbSquares[19].color} onKbSquareClick={() => handleKbClick(kbSquares[19])} />
            <KeyboardSquare value={kbSquares[20].value} color={kbSquares[20].color} onKbSquareClick={() => handleKbClick(kbSquares[20])} />
            <KeyboardSquare value={kbSquares[21].value} color={kbSquares[21].color} onKbSquareClick={() => handleKbClick(kbSquares[21])} />
            <KeyboardSquare value={kbSquares[22].value} color={kbSquares[22].color} onKbSquareClick={() => handleKbClick(kbSquares[22])} />
            <KeyboardSquare value={kbSquares[23].value} color={kbSquares[23].color} onKbSquareClick={() => handleKbClick(kbSquares[23])} />
            <KeyboardSquare value={kbSquares[24].value} color={kbSquares[24].color} onKbSquareClick={() => handleKbClick(kbSquares[24])} />
            <KeyboardSquare value={kbSquares[25].value} color={kbSquares[25].color} onKbSquareClick={() => handleKbClick(kbSquares[25])} />
            <KeyboardSquare value={kbSquares[26].value} color={kbSquares[26].color} onKbSquareClick={() => handleKbClick(kbSquares[26])} />
            <KeyboardSquare value={kbSquares[27].value} color={kbSquares[27].color} onKbSquareClick={() => handleKbClick(kbSquares[27])} />
          </div>

        </>
      )}
      <Link to='/history'>
        <button>HISTORY</button>
      </Link>
    </>
  );
}

export default GamePlay;
