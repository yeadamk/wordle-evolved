import GameBoard from './GameBoard';
import { useEffect, useState } from 'react';
import './History.css';

function HistoryElement({ guesses, colors, targetWord, playerWon, date }) {
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    const zippedArray = [];
    for (let i = 0; i < Object.values(guesses).length; i++) {
      for (let j = 0; j < Object.values(guesses)[0].length; j++) {
        zippedArray.push([Object.values(guesses)[i][j], Object.values(colors)[i][j]]);
      }
    }
    console.log(zippedArray);
    setGameHistory(zippedArray);
  }, []);

  console.log(gameHistory);
  return (
    <>
      <div className='history-container'>
        <GameBoard gameHistory={gameHistory} wordLength={targetWord.length} />
        <div className='history-container-right'>
          <p>{targetWord.length}</p>
          {playerWon ? <p>{gameHistory.length / targetWord.length}</p> : '-'}
          <p>{targetWord}</p>
          {playerWon ? <p className='winning-msg'>WON</p> : <p className='losing-msg'>LOST</p>}
          <p>{new Date(date.seconds * 1000).toLocaleDateString('en-US')}</p>
        </div>
      </div>
    </>
  );
}

export default HistoryElement;
