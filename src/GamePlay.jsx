// JavaScript source code
import './App.css';
import Auth from './Auth';
import { useState } from 'react';

// these functions turn a list into an effective dictionary 
// with key - value pairs of the form "string": integer



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
function checkDictionary(letter, Dict) {

    for (let i = 0; i < Dict.length; i++) {
        if (Dict[i](letter) >= 0) {
            return Dict[i](letter)
        }
    }

    return -1
}


function checkStatus(userGuess, targetWord) {

    const wordLength = userGuess.length
    const lettersDict = new Map() // are maps valid to use?
    let status = []

    for (let j = 0; j < wordLength; j++) {
        if (lettersDict.has(targetWord[j])) {
            lettersDict.set(targetWord[j], lettersDict.get(targetWord[j]) + 1)
        } else {
            lettersDict.set(targetWord[j], 1)
        }
    }

    for (let j = 0; j < wordLength; j++) {
        if (userGuess[j] == targetWord[j]) {
            status.push(2)
            lettersDict.set(targetWord[j], lettersDict.get(targetWord[j]) - 1)
        }
        else {
            status.push(0)
        }
    }

    for (let j = 0; j < wordLength; j++) {
        if (status[j] == 0 && lettersDict.get(targetWord[j]) > 0) {
            status[j] = 1
            lettersDict.set(targetWord[j], lettersDict.get(targetWord[j]) - 1)
        }
    }

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
    validWords = []
    let valid = true

    for (word in words) {

        if (word.length != length) {
            continue
        }

        valid = true
        for (let i = 0; i < word.length; i++) {

            if (word[i] in letterRestrictions) {

                valid = false;
                break;
                // check for '~letter', then invalidates word if it has that letter at index i
            } else if (specificRequirements[i].length > 1 && specificRequirements[i][1] == word[i]) {

                valid = false;
                break;
            } else if (specificRequirements[i].length == 1 && specificRequirements[i] != word[i]) {

                valid = false;
                break;

            }
        }

        if (valid == true) {
            validWords.push(word)
        }
    }

    return validWords[Math.floor(Math.random(0, validWords.length))]
}

function GamePlay() {

    // for now, the dynamic values will be hard-coded
    // TODO: accept input for these
    const wordList = ["hello", "apple", "genes", "races", "horse", "magic", "happy", "lapse"]
    const wordLength = 5
    const maxGuesses = 6
    const letterRestrictions = null
    const specificRequirements = null

    const [message, setMessage] = useState('Click To Start Daily Game!');
    const [showBoard, setShowBoard] = useState(false);

    /* 
    
    currGridSq: one of (wordLength) boxes in gridSquares; these represent individual letters
    gridSquares: one of (maxGuesses) arrays in gridRows; these represent individual guesses
    gridRows: dictionary of rows in a game; this stores all the rows that are actually rendered

    */


    const [currGridSq, setCurrGridSq] = useState(0);
    const [gridSquares, setGridSquares] = useState(Array(wordLength).fill(null));

    const gridRows = Map();
    (gridSquares) => {
        for (let i = 0; i < maxGuesses; i++) {
            gridRows.set(i, gridSquares);
        }
    }

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

    let generatedWord = generateWord(wordList, wordLength,
        letterRestrictions, specificRequirements)

    const [targetWord, setTargetWord] = useState(generatedWord);
    const [userGuess, setUserGuess] = useState('');
    const [restrictType, setRestrictType] = useState(false);
    const [colorArr, setColorArr] = useState(Array(wordLength).fill(null));
    const [numGuesses, setNumGuesses] = useState(0);
    const [playerWon, setPlayerWon] = useState(false);
    const [playerWonOne, setPlayerWonOne] = useState(false);
    const [playerLost, setPlayerLost] = useState(false);
    const [displayInvalid, setDisplayInvalid] = useState(false);

    function handleKbClick(val) {

        nextGridSquares = gridSquares;

        if (val == 'DEL') {

            if (currGridSq > 0) {
                gridSquares[currGridSq - 1] = null;
                setCurrGridSq(currGridSq - 1);
                setRestrictType(false);
                setDisplayInvalid(false);
            }

        } else if (val == 'RET') {

            if (currGridSq % wordLength == 0 && currGridSq != 0 && !playerWon && !playerWonOne && !playerLost) {

                let guess = toString(gridSquares).replaceAll(",", ""); // is replaceAll a valid function?
                if (checkValidWord(guess, wordList)) {


                    setColorArr(checkStatus(guess, targetWord));
                    for (let i = 0; i < wordLength; i++) {
                        /* 
                        TODO:
                        We need to make a Map of rows, ofc of size wordLength * numGuesses
                        Then, based on gridSquares, we update our current guess number on the dict
                        By replacing it with newGridSquares
                        That should make this effectively dynamic
                        */

                        if (colorArr[i] == 0) {
                            nextGridSquares[i] = (
                                <div className='boardsquare' style={{ backgroundColor: 'grey' }}>
                                    {nextGridSquares[i]}
                                </div>
                            );
                        } else if (colorArr[i] == 1) {
                            nextGridSquares[i] = (
                                <div className='boardsquare' style={{ backgroundColor: 'yellow' }}>
                                    {nextGridSquares[i]}
                                </div>
                            );
                        } else if (colorArr[i] == 2) {
                            nextGridSquares[i] = (
                                <div className='boardsquare' style={{ backgroundColor: 'green' }}>
                                    {nextGridSquares[i]}
                                </div>
                            );
                        }
                    }

                    gridRows.set(numGuesses, newGridSquares)
                    setNumGuesses(numGuesses + 1);

                    if (checkWinner(newColorArr) && numGuesses == 0) {
                        setPlayerWonOne(true);

                    } else if (checkWinner(newColorArr)) {
                        setPlayerWon(true);
                    }

                    if (!checkWinner(newColorArr) && numGuesses >= maxGuesses) {
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
                nextGridSquares[currGridSq] = val;
                setCurrGridSq(currGridSq + 1);

                if ((currGridSq + 1) % wordLength == 0) {
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

                    {/* How to make dynamic: Use a for loop for every row in the map
                        *** this is actually the mmotivation for using a dict*/

                        (() => {
                            for (let i = 0; i < maxGuesses; i++) {
                                <div className='board-row'>
                                    {(() => {
                                        for (let j = 0; j < wordLength; j++) {
                                            <GridSquare value={gridRows.get(i)[j]} />
                                        }
                                    })()}
                                </div>
                            }
                        })()
                    }

                    {/* This is good as is! The keys aren't dynamic -- at least, for now... */}
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
