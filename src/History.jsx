import { useEffect, useState } from 'react';
import axios from 'axios';
import HistoryElement from './atoms/HistoryElement';

function History({ uid, userName }) {
  const [history, setHistory] = useState();

  useEffect(() => {
    (async () => {
      const response = await axios.get(`http://localhost:4000/api/gethistory/${uid}`);
      setHistory(response.data);
    })();
  }, []);

  console.log(history);

  return (
    <>
      <h1>{uid ? userName : 'PLEASE SIGN IN'}</h1>
      {history ? (
        history.map((item, index) => (
          <HistoryElement
            key={index}
            guesses={item.guesses}
            colors={item.colors}
            targetWord={item.targetWord}
            date={item.date}
            playerWon={item.playerWon}
          />
        ))
      ) : (
        <h1>PLEASE PLAY SOME GAMES</h1>
      )}
    </>
  );
}

export default History;
