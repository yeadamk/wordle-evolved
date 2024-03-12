import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './atoms/Header';
import { useNavigate } from 'react-router-dom';
import { wordList2 } from './wordleWords_v4.jsx';


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


// IMPORTANT! Depending on whether the word list stores fully capitalized words or lower case words, this may need to change
function checkStatus(userGuess, targetWord) {

    targetWord = targetWord.toUpperCase()
    userGuess = userGuess.toUpperCase()
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
        if (status[j] == 0 && lettersDict.has(userGuess[j]) && lettersDict.get(userGuess[j]) > 0) {
            status[j] = 1
            lettersDict.set(userGuess[j], lettersDict.get(userGuess[j]) - 1)
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

// IMPORTANT! Depending on whether the word list stores fully capitalized words or lower case words, this may need to change
function checkValidWord(userGuess, words) {
   
    if (words.includes(userGuess.toLowerCase())) {
        return true;
    } else {
        return false;
    }
}

function generateWord(words, length, LetterRestrictions, SpecificRequirements) {

    let validWords = []
    let valid = true

    if (LetterRestrictions == null) {
        LetterRestrictions = []
    }

    if (SpecificRequirements == null) {
        SpecificRequirements = []
        for (let i = 0; i < length; i++) {
            SpecificRequirements.push(" ")
        }
    }

    for (let i = 0; i < length; i++) {
        if (SpecificRequirements[i] == "") {
            SpecificRequirements[i] = " ";
        }
    }
   
    for (let i = 0; i < words.length; i++) {

        let word = words[i].toUpperCase();
        if (word.length != length) {
            continue
        }

        valid = true
        for (let j = 0; j < length; j++) {
        
            if (LetterRestrictions.includes(word[j].toUpperCase())) {
                console.log("word " + word + " failed test 1 at letter " + word[j])
                valid = false;
                break;

            } else if (SpecificRequirements[j].length > 1 && (SpecificRequirements[j][1].toUpperCase() == word[j]
                || SpecificRequirements[0].toUpperCase() == word[j])) {
             
                valid = false;
                break;
            } else if (SpecificRequirements[j].length == 1 && SpecificRequirements[j] != " " && SpecificRequirements[j] != "_"
                && SpecificRequirements[j].toUpperCase() != word[j]) {
               
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

function generateWordList() {
    const wordList = ["hello", "apple", "genes", "races", "horse", "magic", "happy", "lapse", "horrid", "george",
        "flower", "quests", "likely", "second", "outcry", "nobody", "a", "ab", "abc", "abcd", "abcde", "abcdef",
        "abcdefg", "abcdefgh", "abcdefghi", "abcdefghij", "abcdefghijk", "abcdefghijkl", "abcdefghijklm", "and", "cap", "can", "dan", "man", "nap", "nab", "mop",
        "tot", "its", "min", "max", "pop", "pip", "pup", "cup",
        "rhino", "homes", "mages", "marsh", "slime", "quote", "feels", "queue", "liver", "white", "black", "brown", "blues", "ligma",
        "laser", "risks", "antic", "china", "ninja", "north", "sight", "night", "reels", "flows", "exile", "orcas", "shred", "music", "muses",
        "blast", "chris", "larry", "barry", "jerry", "timae", "camel", "hints", "share", "crane", "great", "like", "stop", "grab", "grep", "pops",
        "cans", "cons", "onto", "into", "ends", "rave", "gore", "dare", "dire", "mice", "maps", "most", "post", 'tows', 'goes', 'open', 'nobs', 'pens',
        'free', 'seen', 'knee', 'knob', 'knot', 'gnat', "an", "na", "on", "of", "qi", "lo", "my", "hi", "fo", "sk", "po", "pa", "ma", "me", "be"
    ]
    return wordList;
}

function GamePlay({ userId, userName }) {


    const [wordList, setWordList] = useState(generateWordList());
    const [wordLength, setWordLength] = useState(5)
    const [maxGuesses, setMaxGuesses] = useState(6)
    const [letterRestrictions, setLetterRestrictions] = useState(Array(0))
    const [specificRequirements, setSpecificRequirements] = useState(Array(20).fill("_"))


    const [message, setMessage] = useState('Click To Start Daily Game!');
    const [customGameMessage, setCustomGameMessage] = useState('Click to Start Custom Game!')
    const [showBoard, setShowBoard] = useState(false);
    const [showHomeScreen, setShowHomeScreen] = useState(true);
    const [customGame, setCustomGame] = useState(true);
    const [customGameInitializer, setCustomGameInitializer] = useState(false);

    const [wordLengthSlider, setWordLengthSlider] = useState(5); 
    const [maxGuessSlider, setMaxGuessSlider] = useState(6);
    const [letterRestrictionsInput, setLetterRestrictionsInput] = useState(""); 
    const [specificRequirementsBoxes, setSpecificRequirementsBoxes] = useState(Array(20).fill(""));


    const [currGridSq, setCurrGridSq] = useState(0);
    const [gridSquares, setGridSquares] = useState(Array(wordLength).fill(null));
   
    const [gridRowsCopy, setGridRowsCopy] = useState(new Map())
    const [gridRowsSet, setGridRowsSet] = useState(true);


    let gridRows = new Map()

    if (gridRowsSet) {

        let num = 0;
        for (let i = 0; i < wordLength; i++) {
            num++;
        }

        let max = 0;
        for (let i = 0; i < maxGuesses; i++) {
            max++;
        }

   

        for (let i = 0; i < max; i++) {

            gridRows.set(i, Array(num).fill(

                <div className='boardsquare' style={{ backgroundColor: 'white' }}>
                    {null}
                </div>

            ))

        }

        
        setGridRowsSet(false)
        setGridSquares(gridRows.get(0))
        setGridRowsCopy(gridRows)
        
    }


    
    
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


    function handleKbClick(kbButtonSquare) {
     
        const nextGridSquares = gridSquares;
        const nextKbSquares = kbSquares;
        let currentGuess = numGuesses;
        

        if (kbButtonSquare.value == 'DEL') {
            if (currGridSq > 0) {
                nextGridSquares[currGridSq - 1] = null;
                setCurrGridSq(currGridSq - 1);
                setRestrictType(false);
                setDisplayInvalid(false);
               
            }
        } else if (kbButtonSquare.value == 'RET') {

            if (currGridSq % wordLength == 0 && currGridSq != 0 && !playerWon && !playerWonOne && !playerLost) {

        
                const guess = nextGridSquares.toString().replaceAll(",", "").toUpperCase(); 
               
              

                if (checkValidWord(guess, wordList)) {
                    
                    const newColorArr = checkStatus(guess, targetWord);
                    setColorArr(newColorArr);
                    setUserGuesses([...userGuesses, guess]);
                    setGuessColors([...guessColors, newColorArr]);

                    for (let i = 0; i < wordLength; i++) {


                        if (newColorArr[i] == 0) {
                           
                            nextGridSquares[i] = (
                                <div className='GridSquare' style={{ backgroundColor: 'grey' }}>
                                    {nextGridSquares[i]}
                                </div>
                            );
                          
                            if (nextKbSquares[kbInitLettersOnly.indexOf(guess[i])].color === 'white') {
                                nextKbSquares[kbInitLettersOnly.indexOf(guess[i])] = {
                                    ...nextKbSquares[kbInitLettersOnly.indexOf(guess[i])],
                                    color: 'grey'
                                };
                            }

                        } else if (newColorArr[i] == 1) {

                            nextGridSquares[i] = (
                                <div className='GridSquare' style={{ backgroundColor: 'yellow' }}>
                                    {nextGridSquares[i]}
                                </div>
                            );

                            if (nextKbSquares[kbInitLettersOnly.indexOf(guess[i])].color !== 'green') {
                                nextKbSquares[kbInitLettersOnly.indexOf(guess[i])] = {
                                    ...nextKbSquares[kbInitLettersOnly.indexOf(guess[i])],
                                    color: 'yellow'
                                };
                            }

                        } else if (newColorArr[i] == 2) {
                            nextGridSquares[i] = (
                                <div className='GridSquare' style={{ backgroundColor: 'green' }}>
                                    {nextGridSquares[i]}
                                </div>
                            );

                            nextKbSquares[kbInitLettersOnly.indexOf(guess[i])] = {
                                ...nextKbSquares[kbInitLettersOnly.indexOf(guess[i])],
                                color: 'green'
                            };
                        } else {
                        }
                    }

                setKbSquares(nextKbSquares);
                setCurrGridSq(0);
                setNumGuesses(numGuesses + 1);
                currentGuess  += 1;
                
             
                if (checkWinner(newColorArr) && numGuesses == 0) {
                    setPlayerWonOne(true);

                } else if (checkWinner(newColorArr)) {
                    setPlayerWon(true);
                }
           
                if (!checkWinner(newColorArr) && currentGuess >= maxGuesses) {
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
        
        gridRows.set(numGuesses, nextGridSquares);
        setGridSquares(gridRows.get(currentGuess))    
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



 //   document.getElementById('letter-restrictions').addEventListener("input", handleChange)
    function handleLetterRestrictionsChange(event) {
        const text = event.target.value.toUpperCase().replace(/[^A-Z]/g, "");

        setLetterRestrictionsInput(text);
    };

    function handleWordLengthSliderChange(event) {
        const result = event.target.value;
        setWordLengthSlider(result);
    };

    function handleMaxGuessSliderChange(event) {
        const result = event.target.value;
        setMaxGuessSlider(result);
    };


    function handleSpecificRequirementsBoxChange(event, i) {
        const result = event.target.value;
        const copyArray = [...specificRequirementsBoxes];
        copyArray[i] = result.toUpperCase().replace(/[^A-Z~]/, "")
        
        setSpecificRequirementsBoxes(copyArray)
        


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

          {userId ? (


        <>
                  <h1>Wordle Evolved</h1>
                  <div className='card'>
                      <div className='start-button'>
                          {showHomeScreen && (
                              <button
                                  onClick={() => {

                                      setMessage('Button Clicked! Daily Game Starting Now!');
                                      setShowHomeScreen(false);
                                      setShowBoard(true);
                                      setCustomGame(false);
                                  }}>
                                  {' '}
                                  {message}
                              </button>

                          )}
                      </div>
                      <div className='start-button'>
                          {showHomeScreen && (
                              <button
                                  onClick={() => {
                                      setCustomGameMessage('Submit Parameters and Start Custom Game');
                                      setShowHomeScreen(false);
                                      setCustomGameInitializer(true);
                                      setCustomGame(true);

                                  }}>
                                  {' '}
                                  {customGameMessage}
                              </button>

                          )}
                      </div>
                      <p>
                          Edit <code>src/App.jsx</code> and save to test HMR
                      </p>
                  </div>
                  <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>

                  {customGameInitializer && (

                      <div className="game-parameters">
                      
                          <p>Enter word length, max guesses, letter restrictions, and specific requirements</p>

                          <div className="parameter">
                              <label htmlFor="word-length">Word Length:</label>
                              <div>
                                  <input id="word-length" type="range" min="1" max="20" onChange={handleWordLengthSliderChange} value={wordLengthSlider} />
                                  
                                  <label id="word-length-slider-label" htmlFor="word-length">          {wordLengthSlider}</label>
                              </div>
                              
                             
                          </div>

              
                          <div className="parameter">
                              <label htmlFor="max-guesses">Number of Guesses:</label>
                              <div>
                                  <input id="max-guesses" type="range" min="1" max="20" value={maxGuessSlider} onChange={handleMaxGuessSliderChange} />
                                  <label id="max-guesses-slider-label" htmlFor="max-guesses">          {maxGuessSlider}</label>
                              </div>
                           
                          </div>
                          {
                          }
                          <div className="parameter">
                              <label htmlFor="letter-restrictions">Restricted Letters:</label>
                              <div>
                                  <input id="letter-restrictions" size={26} type="text" value={letterRestrictionsInput} onChange={handleLetterRestrictionsChange}
                                      maxLength={26} />
                              </div>
                          </div>
                          <div className="parameter">
                              <label htmlFor="specific-requirements">Specific Requirements for the Word:</label>
                              <div id="specific-requirements">       
                                  {(() => {
                                      let restrictionBoxes = [];
                                      for (let i = 0; i < wordLengthSlider; i++) {
                                          // ADD NOT BOXES
                                          restrictionBoxes.push(
                                              <div key={i} id="specific-requirements-box-div">
                                                 <label htmlFor="specific-requirements-box">Letter {i+1}: </label>
                                                  <input className="specific-requirements-box" key={i} type="text" size="2" maxLength="2"
                                                      value={specificRequirementsBoxes[i]} onChange={(e) => handleSpecificRequirementsBoxChange(e, i)}/>
                                              </div>
                                          )
                                      }
                                      return restrictionBoxes;
                                  })()}
                              </div>
                          </div>
                          

                          <div className="parameter-button">
                              <input type="submit"
                                  onClick={() => {

                                      setWordLength(document.getElementById('word-length').value);
                                      setMaxGuesses(document.getElementById('max-guesses').value);
                                      setLetterRestrictions(document.getElementById('letter-restrictions').value.split(""));

                                      

                                      const selectedWord = generateWord(
                                          wordList,
                                          document.getElementById('word-length').value,
                                          document.getElementById('letter-restrictions').value.split(""),
                                          specificRequirementsBoxes
                                      ).toLowerCase();
                                    
                                      setTargetWord(selectedWord);
                                      setMaxGuesses(maxGuessSlider);
                                      setWordLength(wordLengthSlider);                              
                                      setLetterRestrictions(document.getElementById('letter-restrictions').value.split(""));
                                      setSpecificRequirements(specificRequirementsBoxes);
                                      setGridRowsSet(true);
                                    
                                      const numCopy = maxGuessSlider
                                
                                    
                            
                       
                                      setGridSquares(gridRowsCopy.get(0));
                                    

                                      setMessage('Button Clicked! Custom Game Starting Now!');
                                      setCustomGameInitializer(false);
                                      setShowBoard(true);


                                  }} value="Submit Parameters and Start Custom Game">
                          
                              </input>
                              <p className="explanation">***Specific Requirements are requirements that certain letters appear in certain spaces. For example,
                                  for a 5-letter word, the pattern "a _ _ l _" would mean that the selected word must have an 'a' as its
                                  first letter, and an 'l' as its fourth. You can also use '~' to require a letter NOT be placed in that spot.
                                  for example, "~e ~e ~e ~e ~e" would mean that none of the 5 letters could be 'e', effectively the same as
                                  restricting the letter e! </p>
                          </div>

                      </div>

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
                
                gridRows = gridRowsCopy

             
                let rows = []
                for (let i = 0; i < gridRows.size; i++) {
                    rows.push(
                        <div className='board-row' key={i}>
                            {(() => {
                                let row = []
                                for (let j = 0; j < wordLength; j++) {
                                    row.push(<GridSquare key={j} value={gridRows.get(i)[j]} />)
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
            <KeyboardSquare
              value={kbSquares[0].value}
              color={kbSquares[0].color}
              onKbSquareClick={() => handleKbClick(kbSquares[0])}
            />
            <KeyboardSquare
              value={kbSquares[1].value}
              color={kbSquares[1].color}
              onKbSquareClick={() => handleKbClick(kbSquares[1])}
            />
            <KeyboardSquare
              value={kbSquares[2].value}
              color={kbSquares[2].color}
              onKbSquareClick={() => handleKbClick(kbSquares[2])}
            />
            <KeyboardSquare
              value={kbSquares[3].value}
              color={kbSquares[3].color}
              onKbSquareClick={() => handleKbClick(kbSquares[3])}
            />
            <KeyboardSquare
              value={kbSquares[4].value}
              color={kbSquares[4].color}
              onKbSquareClick={() => handleKbClick(kbSquares[4])}
            />
            <KeyboardSquare
              value={kbSquares[5].value}
              color={kbSquares[5].color}
              onKbSquareClick={() => handleKbClick(kbSquares[5])}
            />
            <KeyboardSquare
              value={kbSquares[6].value}
              color={kbSquares[6].color}
              onKbSquareClick={() => handleKbClick(kbSquares[6])}
            />
            <KeyboardSquare
              value={kbSquares[7].value}
              color={kbSquares[7].color}
              onKbSquareClick={() => handleKbClick(kbSquares[7])}
            />
            <KeyboardSquare
              value={kbSquares[8].value}
              color={kbSquares[8].color}
              onKbSquareClick={() => handleKbClick(kbSquares[8])}
            />
            <KeyboardSquare
              value={kbSquares[9].value}
              color={kbSquares[9].color}
              onKbSquareClick={() => handleKbClick(kbSquares[9])}
            />
          </div>

          <div className='kb-row'>
            <KeyboardSquare
              value={kbSquares[10].value}
              color={kbSquares[10].color}
              onKbSquareClick={() => handleKbClick(kbSquares[10])}
            />
            <KeyboardSquare
              value={kbSquares[11].value}
              color={kbSquares[11].color}
              onKbSquareClick={() => handleKbClick(kbSquares[11])}
            />
            <KeyboardSquare
              value={kbSquares[12].value}
              color={kbSquares[12].color}
              onKbSquareClick={() => handleKbClick(kbSquares[12])}
            />
            <KeyboardSquare
              value={kbSquares[13].value}
              color={kbSquares[13].color}
              onKbSquareClick={() => handleKbClick(kbSquares[13])}
            />
            <KeyboardSquare
              value={kbSquares[14].value}
              color={kbSquares[14].color}
              onKbSquareClick={() => handleKbClick(kbSquares[14])}
            />
            <KeyboardSquare
              value={kbSquares[15].value}
              color={kbSquares[15].color}
              onKbSquareClick={() => handleKbClick(kbSquares[15])}
            />
            <KeyboardSquare
              value={kbSquares[16].value}
              color={kbSquares[16].color}
              onKbSquareClick={() => handleKbClick(kbSquares[16])}
            />
            <KeyboardSquare
              value={kbSquares[17].value}
              color={kbSquares[17].color}
              onKbSquareClick={() => handleKbClick(kbSquares[17])}
            />
            <KeyboardSquare
              value={kbSquares[18].value}
              color={kbSquares[18].color}
              onKbSquareClick={() => handleKbClick(kbSquares[18])}
            />
          </div>

          <div className='kb-row'>
            <KeyboardSquare
              value={kbSquares[19].value}
              color={kbSquares[19].color}
              onKbSquareClick={() => handleKbClick(kbSquares[19])}
            />
            <KeyboardSquare
              value={kbSquares[20].value}
              color={kbSquares[20].color}
              onKbSquareClick={() => handleKbClick(kbSquares[20])}
            />
            <KeyboardSquare
              value={kbSquares[21].value}
              color={kbSquares[21].color}
              onKbSquareClick={() => handleKbClick(kbSquares[21])}
            />
            <KeyboardSquare
              value={kbSquares[22].value}
              color={kbSquares[22].color}
              onKbSquareClick={() => handleKbClick(kbSquares[22])}
            />
            <KeyboardSquare
              value={kbSquares[23].value}
              color={kbSquares[23].color}
              onKbSquareClick={() => handleKbClick(kbSquares[23])}
            />
            <KeyboardSquare
              value={kbSquares[24].value}
              color={kbSquares[24].color}
              onKbSquareClick={() => handleKbClick(kbSquares[24])}
            />
            <KeyboardSquare
              value={kbSquares[25].value}
              color={kbSquares[25].color}
              onKbSquareClick={() => handleKbClick(kbSquares[25])}
            />
            <KeyboardSquare
              value={kbSquares[26].value}
              color={kbSquares[26].color}
              onKbSquareClick={() => handleKbClick(kbSquares[26])}
            />
            <KeyboardSquare
              value={kbSquares[27].value}
              color={kbSquares[27].color}
              onKbSquareClick={() => handleKbClick(kbSquares[27])}
            />
          </div>
        </>
      )}
      <Link to='/history'>
        <button>History</button>
      </Link>
      <Link to='/dataanalytics'>
        <button>Data Analytics</button>
      </Link>
      <Link to='/'>
        <button>Homepage</button>
      </Link>
    </>
  );
}

export default GamePlay;
