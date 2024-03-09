// JavaScript source code
import { useState } from 'react';
import './App.css';


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
          

            if (letterRestrictions.includes(word[j])) {
                console.log("word " + word + " failed test 1")
                valid = false;
                break;
                // check for '~letter', then invalidates word if it has that letter at index i
            } else if (specificRequirements[j].length > 1 && specificRequirements[j][1] == word[j]) {
                console.log("word " + word + " failed test 2")
                valid = false;
                break;
            } else if (specificRequirements[j].length == 1 && specificRequirements[j] != "_"
                && specificRequirements[j] != word[j]) {
                console.log("word " + word + " failed test 3")
                valid = false;
                break;

            }
        }

        if (valid == true) {
            console.log(word)
            validWords.push(word)
        }
    }

    return validWords[Math.floor(Math.random() * validWords.length)]
}


function GamePlay() {

    /*
    const test = new Map()
    test.set(1, Array(8).fill(
 
    console.log(test.get(1))
    console.log(test)
    */

    // for now, the dynamic values will be hard-coded
    // TODO: accept input for these


    const wordList = ["hello", "apple", "genes", "races", "horse", "magic", "happy", "lapse", "horrid", "george",
        "flower", "quests", "likely", "second", "outcry", "nobody", "a", "ab", "abc", "abcd", "abcde", "abcdef",
        "abcdefg", "abcdefgh", "abcdefghi", "abcdefghij", "abcdefghijk", "abcdefghijkl", "abcdefghijklm",
        "rhino", "homes", "mages", "marsh", "slime", "quote", "feels", "queue", "liver", "white", "black", "brown", "blues", "ligma",
        "laser", "risks", "antic", "china", "ninja", "north"]
    


    const wordLength = 5
    const maxGuesses = 6
    const letterRestrictions = ["e"];
    const specificRequirements = ["_", "~a", "~r", "_", "e"]

    const [message, setMessage] = useState('Click To Start Daily Game!');
    const [showBoard, setShowBoard] = useState(false);
    const [currGridSq, setCurrGridSq] = useState(0);
    const [gridSquares, setGridSquares] = useState(Array(wordLength).fill(
    
       <div className='boardsquare' style={{ backgroundColor: 'white' }}>
                          {null}
                     </div>

    ));

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

   

    const [targetWord, setTargetWord] = useState(generateWord(wordList, wordLength,
        letterRestrictions, specificRequirements));

    const [userGuess, setUserGuess] = useState('');
    const [restrictType, setRestrictType] = useState(false);
    let [colorArr, setColorArr] = useState(Array(wordLength).fill(null));
    let [numGuesses, setNumGuesses] = useState(0);
    const [playerWon, setPlayerWon] = useState(false);
    const [playerWonOne, setPlayerWonOne] = useState(false);
    const [playerLost, setPlayerLost] = useState(false);
    const [displayInvalid, setDisplayInvalid] = useState(false);

    let nextGridSquares = Array(wordLength).fill(
        <div className='boardsquare' style={{ backgroundColor: 'white' }}>
            {null}
        </div>
    )

    console.log("word is " + targetWord)


    
    function extractChildren(oldSquares) {
        const squaresCopy = []
        for (let i = 0; i < oldSquares.length; i++) {
            squaresCopy.push(oldSquares[i].props.children)
        }
        return squaresCopy; 
    }

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

                let guess = extractChildren(nextGridSquares).toString().replaceAll(",", "").toLowerCase(); 
       
                if (checkValidWord(guess, wordList)) {
                    // Hack? setColorArr doesn't actaully seem to change the color array by itself here
                    setColorArr(checkStatus(guess, targetWord))
                    colorArr = checkStatus(guess, targetWord)

                   
                    for (let i = 0; i < wordLength; i++) {

                        if (colorArr[i] == 0) {
                            
                            nextGridSquares[i] = (
                                <div className='boardsquare' style={{ backgroundColor: 'grey' }}>
                                    {guess[i]}
                                </div>
                            );
                        } else if (colorArr[i] == 1) {
                         
                            nextGridSquares[i] = (
                                <div className='boardsquare' style={{ backgroundColor: 'yellow' }}>
                                    {guess[i]}
                                </div>
                            );
                        } else if (colorArr[i] == 2) {
                           
                            nextGridSquares[i] = (
                                <div className='boardsquare' style={{ backgroundColor: 'green' }}>
                                    {guess[i]}
                                </div>
                            );
                        }
                    }
           
                    // Hack? setNumGuesses doesn't actaully seem to change the number of guesses by itself here
                    setNumGuesses(numGuesses + 1);
                    numGuesses += 1;
                    setCurrGridSq(0);

                    nextGridSquares = Array(wordLength).fill(null);

                    if (checkWinner(colorArr) && numGuesses == 1) {
                        setPlayerWonOne(true);

                    } else if (checkWinner(colorArr)) {
                        setPlayerWon(true);
                    }

                    if (!checkWinner(colorArr) && numGuesses >= maxGuesses) {
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
                nextGridSquares[currGridSq] = (
                     <div className='boardsquare' style={{ backgroundColor: 'white' }}>
                          {val}
                     </div>
                );
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


                     {  
                        (() => {
                            //hack to work around the fact that gridRows is not a component
                            gridRows = gridRowsCopy
                            let rows = []
                            for (let i = 0; i < maxGuesses; i++) {
                                rows.push(
                                <div className='board-row' key = {i}>
                                    {(() => {
                                        let row = []
                                        for (let j = 0; j < wordLength; j++) {                                        
                                            row.push(<GridSquare value = {gridRows.get(i)[j]} />)
                                        }
                                        return row
                                    })()}                         
                                </div>
                                )
                            }
                            return rows
                        })()

                        /* STORAGE:

                        return (gridRows.keys).map(())

                        */
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
