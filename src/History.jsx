import { useEffect, useState } from 'react';
import axios from 'axios';

function History({ uid }) {
  const [history, setHistory] = useState();

  useEffect(() => {
    (async () => {
      const response = await axios.get(`http://localhost:4000/api/gethistory/${uid}`);
      setHistory(response.data);
    })();
  }, []);

  return (
    <>
      <h1>HELLO {uid ? uid : 'PLEASE SIGN IN'}</h1>
      {history ? (
        history.map((item, index) => (
          <div key={index}>
            <h1>{item.targetWord}</h1>
          </div>
        ))
      ) : (
        <h1>PLEASE PLAY SOME GAMES</h1>
      )}
    </>
  );
}

export default History;
