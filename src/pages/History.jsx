import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import HistoryElement from './atoms/HistoryElement';
import HistoryLegend from './atoms/HistoryLegend';
import Header from './atoms/Header';

function History({ uid, userName }) {
  const [history, setHistory] = useState();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [filterContent, setFilterContent] = useState('');

  useEffect(() => {
    console.log('api call');
    (async () => {
      const response = await axios.get(`http://localhost:4000/api/gethistory/${uid}`);
      setHistory(response.data);
    })();
  }, [uid]);

  useEffect(() => {
    if (!uid) {
      navigate('/auth');
    }
  }, [uid, navigate]);

  return (
    <>
      {uid && <Header userId={uid} userName={userName} />}
      <div className='user-box'>
        {uid ? (
          <div>
            <FontAwesomeIcon icon={faCircleUser} size='3x' />
            <p>{userName}</p>
          </div>
        ) : (
          <Link to='/auth'>
            <button>signin</button>
          </Link>
        )}
      </div>

      <div className='history-hero'>
        <HistoryLegend
          filter={filter}
          setFilter={setFilter}
          filterContent={filterContent}
          setFilterContent={setFilterContent}
          setHistory={setHistory}
          uid={uid}
          history={history}
        />
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
      </div>
    </>
  );
}

export default History;
