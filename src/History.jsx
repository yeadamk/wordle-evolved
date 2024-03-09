import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function History({ uid }) {
  const [history, setHistory] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await axios.get(`http://localhost:4000/api/gethistory/${uid}`);
      setHistory(response.data);
    })();
  }, []);

  useEffect(() => {
    if (!uid){
      navigate("/auth");
    }
  }, [uid, navigate]);

  return (
    <>
      {uid ? (<h1>HELLO {uid} </h1>) : null}
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
