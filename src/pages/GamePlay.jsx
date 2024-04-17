import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from './atoms/Header';
import '../styles/GamePlay.css';

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
  targetWord = targetWord.toUpperCase();
  userGuess = userGuess.toUpperCase();
  const wordLength = userGuess.length;
  const lettersDict = new Map();
  let status = [];

  for (let j = 0; j < wordLength; j++) {
    if (lettersDict.has(targetWord[j])) {
      lettersDict.set(targetWord[j], lettersDict.get(targetWord[j]) + 1);
    } else {
      lettersDict.set(targetWord[j], 1);
    }
  }

  for (let j = 0; j < wordLength; j++) {
    if (userGuess[j] == targetWord[j]) {
      status.push(2);
      lettersDict.set(targetWord[j], lettersDict.get(targetWord[j]) - 1);
    } else {
      status.push(0);
    }
  }

  for (let j = 0; j < wordLength; j++) {
    if (status[j] == 0 && lettersDict.has(userGuess[j]) && lettersDict.get(userGuess[j]) > 0) {
      status[j] = 1;
      lettersDict.set(userGuess[j], lettersDict.get(userGuess[j]) - 1);
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

async function checkValidWord(userGuess) {
  console.log("userGuess is ")
  console.log(userGuess)
  try {
    
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${userGuess}`);
    console.log("YES, we found your word")
    return response.status === 200;
  } catch (error) {
    console.log("did not find word")
    if (error.response && error.response.status === 404) {
      return false;
    }
  }
}



function generateWord(words, length, LetterRestrictions, SpecificRequirements) {
  let validWords = [];
  let checkList = [];
  let valid = true;
  let index = 0;

  if (LetterRestrictions == null) {
    LetterRestrictions = [];
  }

  if (SpecificRequirements == null) {
    SpecificRequirements = [];
    for (let i = 0; i < length; i++) {
      SpecificRequirements.push(' ');
    }
  }



  for (let i = 0; i < 20; i++) {
    if (SpecificRequirements[i] == '' || SpecificRequirements[i] == '~' || SpecificRequirements[i] == '_') {
      SpecificRequirements[i] = ' ';
    }
    }


    console.log(SpecificRequirements);

    for (let i = 0; i < length; i++) {
        if (SpecificRequirements[i] != ' ') {
            checkList.push(i);
        }
    }


  for (let i = 0; i < words.length; i++) {
    let word = words[i].toUpperCase();
    if (word.length != length) {
      continue;
      }
 
      valid = true;

      if (checkList.length != 0) {
          for (let j = 0; j < checkList.length; j++) {
              index = checkList[j];
              if (SpecificRequirements[index].length == 1 && SpecificRequirements[index] != word[index]) {
                  valid = false;
              }
              else if (SpecificRequirements[index].length != 1 && SpecificRequirements[index] == word[index]) {
                  valid = false;
              }
          }
      }

      if (!valid) {
          continue; 
      }

      if (LetterRestrictions.length == 0) {
          validWords.push(word);
          continue;
      }
    
    for (let j = 0; j < length; j++) {
      if (LetterRestrictions.includes(word[j].toUpperCase())) {
       // console.log('word ' + word + ' failed test 1 at letter ' + word[j]);
        valid = false;
        break;
      } 
    }

    if (valid == true) {
      validWords.push(word);
    }
  }
    if (validWords.length == 0) {
        return ""; 
    }
  return validWords[Math.floor(Math.random() * validWords.length)];
}

// Idea to save memory: make this a function, not a component; don't save the output; 
// Learn how to make a load screen while waiting for the word to generate? 
async function generateWordList() {
  try {
    const response = await axios.get('https://random-word-api.herokuapp.com/all');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

function GamePlay({ userId, userName }) {
  // maybe we don't have to store this
  const [wordList, setWordList] = useState([]);
  useEffect(() => {
    async function fetchWordList() {
      try {
        const fetchedWordList = await generateWordList();
        setWordList(fetchedWordList);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchWordList();
  }, []);

  const [wordLength, setWordLength] = useState(5);
  const [maxGuesses, setMaxGuesses] = useState(6);
  const [numGames, setNumGames] = useState(1);
  const [letterRestrictions, setLetterRestrictions] = useState(Array(0));
  const [specificRequirements, setSpecificRequirements] = useState(Array(20).fill('_'));

  const [message, setMessage] = useState('Daily Game');
  const [customGameMessage, setCustomGameMessage] = useState('Custom Game');
  const [showBoard, setShowBoard] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [showHomeScreen, setShowHomeScreen] = useState(true);
  const [dailyGame, setDailyGame] = useState(false);
  const [customGame, setCustomGame] = useState(true);
  const [customGameInitializer, setCustomGameInitializer] = useState(false);
  const [multiGame, setMultiGame] = useState(false);

  const [wordLengthSlider, setWordLengthSlider] = useState(5);
  const [maxGuessSlider, setMaxGuessSlider] = useState(6);
  const [numGamesSlider, setNumGamesSlider] = useState(1);
  const [letterRestrictionsInput, setLetterRestrictionsInput] = useState('');
  const [specificRequirementsBoxes, setSpecificRequirementsBoxes] = useState(Array(20).fill(''));
  const [specificRequirementsCheckBoxes, setSpecificRequirementsCheckBoxes] = useState(Array(20).fill(1));
  // shorten names??? ^^^^

  const [currGridSq, setCurrGridSq] = useState(0);

  let gnum = 0;
  for (let i = 0; i < numGames; i++) {
    gnum++;
  }
  

  const [gridSquares, setGridSquares] = useState(Array(gnum).fill(Array(wordLength)));
  // THE PROBLEM! gridRows copy has only a shallow copy here; we need deep copies; 
  const [gridRowsCopy, setGridRowsCopy] = useState(Array(gnum));
  const [gridRowsSet, setGridRowsSet] = useState(true);
  const [targetWord, setTargetWord] = useState(Array(numGames).fill(null));


  if (gridRowsSet) {
    let num = 0;

    //I'm no longer sure why nextGridSquares would need to be defined here -- try removing it
    const nextGridRows = Array(gnum);
    const nextGridSquares = Array(gnum).fill(Array(wordLength).fill(null));

  //  console.log("nextGRIDROWS")
   // console.log(nextGridRows);
    for (let i = 0; i < wordLength; i++) {
      num++;
    }

    let max = 0;
    for (let i = 0; i < maxGuesses; i++) {
      max++;
    }

    for (let j = 0; j < numGames; j++) {
      nextGridRows[j] = new Map();
      for (let i = 0; i < max; i++) {
        nextGridRows[j].set(
          i,
          Array(num).fill(
            <div className='boardsquare' style={{ backgroundColor: 'white' }}>
              {null}
            </div>,
          ),
        );
      }

      nextGridSquares[j] = nextGridRows[j].get(0);

    }
   // console.log("now")
   // console.log(nextGridRows)
    setGridRowsCopy(nextGridRows);
    setGridRowsSet(false);
    setGridSquares(nextGridSquares);

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

  const [kbSquares, setKbSquares] = useState(kbInit);
  const [userGuesses, setUserGuesses] = useState([]);
  const [guessColors, setGuessColors] = useState(Array(numGames).fill(null));


  // problem with multiGame?

  let checkBool = false;

  for (let i = 0; i < numGames; i++) {
    if (targetWord[i] == null) {
      checkBool = true;
    }
  }

  if (checkBool && wordList.size > 0) {
    useEffect(() => {

      const addArray = [];
      let newTargetWord = "";
      for (let i = 0; i < numGames; i++) {
        //await?
        newTargetWord = generateWord(wordList, wordLength, letterRestrictions, specificRequirements);
        addArray.push(newTargetWord);
      }
      setTargetWord(addArray);
    }, [wordList, wordLength, letterRestrictions, specificRequirements]);
  }
  //does this need to be an array?
  const [restrictType, setRestrictType] = useState(false);
  let [colorArr, setColorArr] = useState(Array(numGames).fill(null));

  const [playerWon, setPlayerWon] = useState(Array(numGames).fill(false));;
  const [playerLost, setPlayerLost] = useState(Array(numGames).fill(false));
  const [numGuesses, setNumGuesses] = useState(Array(numGames).fill(0)); // rename currentGuess?
  const [displayInvalid, setDisplayInvalid] = useState(false);

  

  async function handleKbClick(kbButtonSquare) {
    console.log("start!")
    console.log(numGuesses)
    console.log(targetWord)

    //TESTING ONLY2
   // setPlayerWon(Array(numGames).fill(true));

    const playerWonArr = playerWon;
    const playerLostArr = playerLost;
    const nextGridSquares = gridSquares;
    const numGuessesArr = numGuesses;
    const nextGridRows = gridRowsCopy;
    const nextKbSquares = kbSquares;

    let ret = false;


    for (let j = 0; j < numGames; j++) { 
      console.log("game #" + j)

      let currentGuess = numGuesses[j];
      

      if (kbButtonSquare.value == 'DEL') {

        if (currGridSq > 0) {
          nextGridSquares[j][currGridSq - 1] = null;
          setCurrGridSq(currGridSq - 1);
          setRestrictType(false);
          setDisplayInvalid(false);
        }
      } else if (kbButtonSquare.value == 'RET') {
        //This might be off-placed
        if (currGridSq % wordLength == 0 && currGridSq != 0 && !playerWonArr[j] && !playerLostArr[j]) { 
  
          //swap i's, j's later

      

          let addStr = "";
      
          for (let k = 0; k < wordLength; k++) {
            addStr += nextGridSquares[j][k]
          }
          
          const guess = addStr.toUpperCase(); // fix the specifics! Should be array of all words
          // problem with awaits being too slow now? this is why we need to store the dictionary?

       //   console.log("guess for game " + j + "immediately after construction")
       //   console.log(guess)
    

          if (await checkValidWord(guess)) { // repeated work from checkAllWords here
              // might be a reason to re-factor such that the loops happen individually in each case;
          //  console.log("proceeding to grade the word on game " + j)
 
            const newColorArr = checkStatus(guess, targetWord[j]);

            setUserGuesses([...userGuesses, guess]);
            setGuessColors([...guessColors, newColorArr]);
            console.log("The grades for game " + j)
            console.log(newColorArr)
            for (let i = 0; i < wordLength; i++) {
          
             
              if (newColorArr[i] == 0) {
              //  console.log("hit grey for letter " + i + " of word " + j)
                nextGridSquares[j][i] = (
                  <div className='GridSquare' style={{ backgroundColor: 'grey' }}>
                    {nextGridSquares[j][i]}
                  </div>
                );

                if (nextKbSquares[kbInitLettersOnly.indexOf(guess[i])].color === 'white') {
                  nextKbSquares[kbInitLettersOnly.indexOf(guess[i])] = {
                    ...nextKbSquares[kbInitLettersOnly.indexOf(guess[i])],
                    color: 'grey',
                  };
                }
              } else if (newColorArr[i] == 1) {
           //     console.log("hit yellow for letter " + i + " of game " + j)
                nextGridSquares[j][i] = (
                
                  <div className='GridSquare' style={{ backgroundColor: 'yellow' }}>
                    {nextGridSquares[j][i]}
                  </div>
                );

              if (nextKbSquares[kbInitLettersOnly.indexOf(guess[i])].color !== 'green') {
              //  console.log("hit yellow for letter " + i + " of game " + j)
                  nextKbSquares[kbInitLettersOnly.indexOf(guess[i])] = {
                    ...nextKbSquares[kbInitLettersOnly.indexOf(guess[i])],
                    color: 'yellow',
                  };
                }
            } else if (newColorArr[i] == 2) {
            //  console.log("hit green for letter " + i + " of game " + j)
                nextGridSquares[j][i] = (
                  <div className='GridSquare' style={{ backgroundColor: 'green' }}>
                    {nextGridSquares[j][i]}
                  </div>
                );

                nextKbSquares[kbInitLettersOnly.indexOf(guess[i])] = {
                  ...nextKbSquares[kbInitLettersOnly.indexOf(guess[i])],
                  color: 'green',
                };
              }
            }

            setKbSquares(nextKbSquares);
            setCurrGridSq(0);
            currentGuess += 1;

            if (checkWinner(newColorArr)) {
              playerWonArr[j] = true;
            }

            if (!checkWinner(newColorArr) && currentGuess >= maxGuesses) {
              playerLostArr[j] = true;
            }

            setRestrictType(false);
            setDisplayInvalid(false);
            ret = true;

          } else {
            setDisplayInvalid(true);
          }
        }
          
      } else {
      

        if (!restrictType && !playerWon[j] && !playerLost[j]) {
          nextGridSquares[j][currGridSq] = kbButtonSquare.value;
          setCurrGridSq(currGridSq + 1);

        //  console.log("here!")

          if ((currGridSq + 1) % wordLength == 0) {
            setRestrictType(true);
          }
          setDisplayInvalid(false);
        }
      }

      /*
      console.log(j + "th game's entry in nextGridSquares + rows before set; game" + j)
      console.log("nextGridSquares")
      console.log(nextGridSquares[j])
      console.log("ROWS!")
      console.log(nextGridRows[j])
      */
     console.log("numGuesses for game " + j)
      console.log(numGuesses)
      nextGridRows[j].set(numGuesses[j], nextGridSquares[j]);
      nextGridSquares[j] = nextGridRows[j].get(currentGuess);
      numGuessesArr[j] = currentGuess;
      

      /*
      console.log(j + "th game's entry in nextGridSquares + rows AFTeR set; game" + j)
      console.log("nextGridSquares")
      console.log(nextGridSquares[j])
      console.log("ROWS!")
      console.log(nextGridRows[j])
      */
     

    }

    setPlayerWon(playerWonArr);
    setPlayerLost(playerLostArr);
    setNumGuesses(numGuessesArr);
    setGridRowsCopy(nextGridRows);
    setGridSquares(nextGridSquares);

  }


  useEffect(() => {
    const reformattedUserGuesses = { ...userGuesses };
    const reformattedColors = { ...guessColors };
    const history = {
      guesses: reformattedUserGuesses,
      colors: reformattedColors,
      targetWord: targetWord[0],
      playerWon: playerWon[0],
      uid: userId,
    };
    if (playerWon[0] || playerLost[0]) {
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


  function handleWordLengthSliderChange(event) {
    const result = event.target.value;
    setWordLengthSlider(result);
  }

  function handleMaxGuessSliderChange(event) {
    const result = event.target.value;
    setMaxGuessSlider(result);
  }

  function handleNumGamesSliderChange(event) {
    const result = event.target.value;
    setNumGamesSlider(result);
  }

  function handleLetterRestrictionsChange(event) {
    const text = event.target.value.toUpperCase().replace(/[^A-Z]/g, '');

    setLetterRestrictionsInput(text);
  }

  function handleLetterRequirementsChange(event) {
    const text = event.target.value.toUpperCase().replace(/[^A-Z]/g, '');

    setLetterRestrictionsInput(text);
  }

  function handleSpecificRequirementsBoxChange(event, i) {
    const result = event.target.value;

    const copyArray = [...specificRequirementsBoxes];
    copyArray[i] = result.toUpperCase().replace(/[^A-Z]/, '');

    setSpecificRequirementsBoxes(copyArray);
  }

  function handleSpecificRequirementsCheckBoxChange(event, i) {
    const result = event.target.value;
    const copyArray = [...specificRequirementsCheckBoxes];

    if (result == 1) {
      copyArray[i] = 0;
    } else {
      copyArray[i] = 1;
    }

    setSpecificRequirementsCheckBoxes(copyArray);
    }


    function singleGame(gameNumber) {
      return (
        <>
          <div className='single-game'>

            {playerWon[gameNumber] && (
                <>
                    <div> 
                  <p> You won! It took you {numGuesses[gameNumber]} {(() => {
                    if (numGuesses[gameNumber] != 1) { return "guesses!" }
                    else {return  "guess!"}
                  })()} </p>
                    </div>
                </>
            )}

            {playerLost[gameNumber] && (
                <>
                    <div>
                  <p> Game over! The word was {targetWord[gameNumber]}. </p>
                    </div>
                </>
            )}

            {(!playerLost[gameNumber] && !playerWon[gameNumber] && !displayInvalid) && (
              <>
                <div>
                  <p> Game {gameNumber + 1}: </p>
                </div>
              </>
            )}

            {(() => {
        // console.log(gridRowsCopy[gameNumber])
              const gameRows = gridRowsCopy[gameNumber]
             // console.log("target word " + gameNumber + ": " + targetWord[gameNumber])
              let rows = [];
              /*
              console.log("gameRows for game " + gameNumber)
              //console.log(playerWon)
              console.log(gameRows)
              console.log("for testing: ")
              console.log(gridRowsCopy[0])
              console.log(gridRowsCopy[1])
              console.log("length")
              console.log(gameRows.size)
              console.log(gameRows.size == 6)
              */

              for (let i = 0; i < gameRows.size; i++) {
                  //  console.log("here")
                   
                    rows.push(
                        <div className='board-row' key={i}>
                            {(() => {
                          let row = [];

                          for (let j = 0; j < gameRows.get(i).length; j++) {
                                    //console.log("here1")
                                
                                    row.push(<GridSquare key={j} value={gameRows.get(i)[j]} />);
                                }
                                return row;
                            })()}
                        </div>,
                    );
                }
                return rows;
            })()}
          </div>
        </>
        )
    }


  return (
    <>
      <Header userId={userId} userName={userName} />
      <div className='game-container'>
        {userId ? (
          <main>
            <section className={`card ${buttonClicked ? 'hidden' : ''}`}>
              <h2>Basic Rules</h2>
              <p className='description'>
                If a square is green, you guessed the correct position of a letter in the word. If a square is yellow,
                it means you guessed a letter that is in the word but not in the correct spot. If the square does not
                change color, the letter is not in the word.
              </p>
              <div className='button-container'>
                {showHomeScreen && (
                  <button
                    className='start-button'
                    onClick={() => {
                      setMessage('Button Clicked! Daily Game Starting Now!');
                      setShowHomeScreen(false);
                      setShowBoard(true);
                      setCustomGame(false);
                      setButtonClicked(true);
                      setDailyGame(true);
                    }}>
                    {' '}
                    {message}
                  </button>
                )}
                {showHomeScreen && (
                  <button
                    className='start-button'
                    onClick={() => {
                      setCustomGameMessage('Submit Parameters and Start Custom Game');
                      setShowHomeScreen(false);
                      setCustomGameInitializer(true);
                      setCustomGame(true);
                      setDailyGame(false);
                      setButtonClicked(true);
                    }}>
                    {' '}
                    {customGameMessage}
                  </button>
                )}
              </div>
            </section>

            {customGameInitializer && (
              <div className='game-parameters'>
                <p>Enter word length, max guesses, letter restrictions, and specific requirements</p>

                <div className='parameter'>
                  <label htmlFor='word-length'>Word Length:</label>
                  <div>
                    <input
                      id='word-length'
                      type='range'
                      min='1'
                      max='15'
                      onChange={handleWordLengthSliderChange}
                      value={wordLengthSlider}
                    />

                    <label id='word-length-slider-label' htmlFor='word-length'>
                      {' '}
                      {wordLengthSlider}
                    </label>
                  </div>
                </div>

                <div className='parameter'>
                  <label htmlFor='max-guesses'>Number of Guesses:</label>
                  <div>
                    <input
                      id='max-guesses'
                      type='range'
                      min='1'
                      max='15'
                      value={maxGuessSlider}
                      onChange={handleMaxGuessSliderChange}
                    />
                    <label id='max-guesses-slider-label' htmlFor='max-guesses'>
                      {' '}
                      {maxGuessSlider}
                    </label>
                  </div>
                </div>

                <div className='parameter'>
                  <label htmlFor='num-games'>Number of Games:</label>
                  <div>
                    <input
                      id='num-games'
                      type='range'
                      min='1'
                      max='10'
                      value={numGamesSlider}
                      onChange={handleNumGamesSliderChange}
                    />
                    <label id='num-games-slider-label' htmlFor='num-games'>
                      {' '}
                      {numGamesSlider}
                    </label>
                  </div>
                </div>

                
                <div className='parameter'>
                  <label htmlFor='letter-restrictions'>Restricted Letters:</label>
                  <div>
                    <input
                      id='letter-restrictions'
                      size={26}
                      type='text'
                      value={letterRestrictionsInput}
                      onChange={handleLetterRestrictionsChange}
                      maxLength={26}
                    />
                  </div>
                </div>
                <div className='parameter'>
                  <label htmlFor='specific-requirements'>Specific Requirements for the Word:</label>
                  <div id='specific-requirements'>
                    {(() => {
                      let restrictionBoxes = [];
                      for (let i = 0; i < wordLengthSlider; i++) {
                        restrictionBoxes.push(
                          <div key={i} id='specific-requirements-box-div'>
                            <label htmlFor='specific-requirements-box'>Letter {i + 1}: </label>
                            <input
                              className='specific-requirements-box'
                              key={i}
                              type='text'
                              size='2'
                              maxLength='1'
                              value={specificRequirementsBoxes[i]}
                              onChange={(e) => handleSpecificRequirementsBoxChange(e, i)}
                            />
                            <label htmlFor='specific-requirements-box'>
                              {' '}
                              NOT:
                              <input
                                type='checkbox'
                                value={specificRequirementsCheckBoxes[i]}
                                onChange={(e) => handleSpecificRequirementsCheckBoxChange(e, i)}
                              />
                            </label>
                          </div>,
                        );
                      }
                      return restrictionBoxes;
                    })()}
                  </div>
                </div>

                <div>
                  <input
                    className='parameter-button'
                    type='submit'
                    onClick={() => {
                      setWordLength(document.getElementById('word-length').value);
                      setMaxGuesses(document.getElementById('max-guesses').value);
                      setLetterRestrictions(document.getElementById('letter-restrictions').value.split(''));

                      for (let i = 0; i < 20; i++) {
                        if (!specificRequirementsCheckBoxes[i]) {
                          specificRequirementsBoxes[i] = '~' + specificRequirementsBoxes[i];
                        }
                      }

                   
                      let selectedWord = Array(numGamesSlider).fill(null);
                      let numGuessesArr = Array(numGamesSlider).fill(null);
              //        let nextGridSquares = Array(numGames).fill(Array(wordLength).fill(null));
                      console.log("SELECTIon")
                      for (let j = 0; j < numGamesSlider; j++) {
                        selectedWord[j] = generateWord(
                          wordList,
                          document.getElementById('word-length').value,
                          document.getElementById('letter-restrictions').value.split(''),
                          specificRequirementsBoxes,
                        ).toLowerCase();
                        console.log(selectedWord[j])
                        numGuessesArr[j] = 0;

                        if (selectedWord[j] == "") {
                          alert("No word meets these requirements!")
                          return;
                        }


                   //     nextGridSquares[j] = selectedWord[j].split("");
                      }

                      setTargetWord(selectedWord);
                      setMaxGuesses(maxGuessSlider);
                      setWordLength(wordLengthSlider);
                      setNumGames(numGamesSlider);
                      setNumGuesses(numGuessesArr);
                      setLetterRestrictions(document.getElementById('letter-restrictions').value.split(''));
                      setSpecificRequirements(specificRequirementsBoxes);
                      setGridRowsSet(true);

                      if (numGamesSlider > 1) {
                        setMultiGame(true); 
                      }

   

                      setMessage('Button Clicked! Custom Game Starting Now!');
                      setCustomGameInitializer(false);
                      setShowBoard(true);
                    }}
                    value='Start Custom Game'></input>
                </div>
                <p className='explanation'>
                  ***Specific Requirements are requirements that certain letters appear in certain spaces. For example,
                  for a 5-letter word, the pattern "a _ _ l _" would mean that the selected word must have an 'a' as its
                  first letter, and an 'l' as its fourth. You can also use the NOT box to require a letter NOT be placed
                  in that spot. For example, "NOT e, NOT e, NOT e, NOT e, NOT e"" would mean that none of the 5 letters
                  could be 'e', effectively the same as restricting the letter e!{' '}
                </p>
              </div>
            )}
            <div className={`button-container ${buttonClicked ? 'hidden' : ''}`}>
              <Link to='/history'>
                <button className='start-button'>History</button>
              </Link>
              <Link to='/dataanalytics'>
                <button className='data-button'>Data Analytics</button>
              </Link>
            </div>
          </main>
        ) : (
          <>
            <h1 className='signin-text'>PLEASE SIGN IN</h1>
            <Link to='/auth'>
              <button className='signin-button'>SIGN IN</button>
            </Link>
          </>
        )}
        <section className={`gameboard ${showBoard ? '' : 'hidden'}`}>
                  {showBoard && (

            
            <>
              <div className='multi-game-container'>
                {(() => {

                  if (!multiGame) {
                      return singleGame(0)
                  }
           
                  let rows = []; 
                 // console.log("copy")
                 // console.log(gridRowsCopy)
                  let c = 0;
   
                  for (let item in gridRowsCopy) {
                    c++;
                  }
                  
                 // console.log(c)
                 
                  for (let i = 0; i < c; i++) {
                    rows.push(
                      singleGame(i)
                    )
                  }
                  return rows

                })()}
              </div>

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
        </section>
      </div>
    </>
  );
}

export default GamePlay;
