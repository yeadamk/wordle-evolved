import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from './atoms/Header';
import '../styles/DataAnalytics.css';

function DataAnalytics({ uid, userName }) {
  const [data, setData] = useState();
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [averageGuesses, setAverageGuesses] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [totalLosses, setTotalLosses] = useState(0);
  const [winPercentage, setWinPercentage] = useState(0);
  const [currentWinStreak, setCurrentWinStreak] = useState(0);
  const [maxWinStreak, setMaxWinStreak] = useState(0);
  const [averageTargetWordLength, setaverageTargetWordLength] = useState(0);
  const [numOnes, setNumOnes] = useState(0);
  const [numTwos, setNumTwos] = useState(0);
  const [numThrees, setNumThrees] = useState(0);
  const [numFours, setNumFours] = useState(0);
  const [numFives, setNumFives] = useState(0);
  const [numSixes, setNumSixes] = useState(0);
  const [gamesCompleted, setGamesCompleted] = useState(0);
  const [allIndexs, setLast] = useState([]);
  const [allVals, setVals] = useState([]);
  const [allObjects, setObjects] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(`http://localhost:4000/api/gethistory/${uid}`);
      setData(response.data);
    })();
  }, []);

  useEffect(() => {
    if (data) {
      const ones = data.filter((item) => item.numGuesses === 1).length;
      const twos = data.filter((item) => item.numGuesses === 2).length;
      const threes = data.filter((item) => item.numGuesses === 3).length;
      const fours = data.filter((item) => item.numGuesses === 4).length;
      const fives = data.filter((item) => item.numGuesses === 5).length;
      const sixes = data.filter((item) => item.numGuesses === 6 && item.playerWon == true).length;
      const totalG = data.map((item) => item.numGuesses).reduce((acc, guesses) => acc + guesses, 0);
      const totalLengthOfAllTargetWords = data
        .map((item) => item.length)
        .reduce((acc, wordLength) => acc + wordLength, 0);
      const numberWins = data.filter((item) => item.playerWon == true).length;
      const numberLosses = data.filter((item) => item.playerWon == false).length;
      const averageTargetWordLen = totalLengthOfAllTargetWords / data.length;
      const averageG = totalG / data.length;
      const winPer = (numberWins / data.length) * 100;
      const gamesCompleted = numberWins + numberLosses;

      let tmpCurrWS = 0;
      let maxWS = 0;

      let currWS = 0;
      let keepIncrementing = true;

      let last = 0;
      let allIndex = new Array(6).fill(0);
      let guesses = [numOnes, numTwos, numThrees, numFours, numFives, numSixes];
      let zip = (a1, a2) => a1.map((x, i) => [x, a2[i]]);
      if (last > 0 && last < 7) {
        allIndex.splice(last - 1, 0, 1);
      }

      data.forEach((item) => {
        if (item.playerWon) {
          tmpCurrWS++;
          maxWS = Math.max(tmpCurrWS, maxWS);
          last = item.numGuesses;
        } else {
          tmpCurrWS = 0;
        }
      });

      data.forEach((item) => {
        if (item.playerWon && keepIncrementing) {
          currWS++;
        } else {
          keepIncrementing = false;
        }
      });

      setGamesPlayed(data.length);
      setTotalGuesses(totalG);
      setTotalWins(numberWins);
      setTotalLosses(numberLosses);
      setWinPercentage(winPer);
      setCurrentWinStreak(currWS);
      setMaxWinStreak(maxWS);
      setAverageGuesses(averageG);
      setaverageTargetWordLength(averageTargetWordLen);
      setNumOnes(ones);
      setNumTwos(twos);
      setNumThrees(threes);
      setNumFours(fours);
      setNumFives(fives);
      setNumSixes(sixes);

      setGamesCompleted(gamesCompleted);
      setVals([ones, twos, threes, fours, fives, sixes]);
      setLast(allIndex);
      setObjects(zip(allVals, allIndexs));

      console.log('Games played: ', gamesPlayed);
      console.log('Total guesses: ', totalGuesses);
      console.log('Average guesses: ', averageGuesses);
      console.log('Total wins: ', totalWins);
      console.log('Total losses: ', totalLosses);
      console.log('Win percentage: ', winPercentage);
      console.log('Current win streak: ', currentWinStreak);
      console.log('Max win streak: ', maxWinStreak);
      console.log('Average target word length: ', averageTargetWordLength);
      console.log('Num one: ', numOnes);
      console.log('Num twos: ', numTwos);
      console.log('Num threes: ', numThrees);
      console.log('Num four: ', numFours);
      console.log('Num fours: ', numFours);
      console.log('Num fives: ', numFives);
      console.log('Num sixes: ', numSixes);
      console.log('Games Completed: ', gamesCompleted);
      console.log('Last Won: ', last);
      console.log('SetLast: ', allIndexs);
      console.log('AllVals', allVals);
      console.log('Objs:', allObjects);
    }
  }, [data]);

  return (
    <>
      {uid && <Header userId={uid} userName={userName} />}
      <div className='user-box'>
        {data ? (
          <div>
            <FontAwesomeIcon icon={faCircleUser} size='3x' />
            <p className='line'>{userName}</p>
          </div>
        ) : (
          <Link to='/auth'>
            <button>signin</button>
          </Link>
        )}
        <div className='up'>
          <h1>Played</h1>
          <h2>{gamesPlayed}</h2>
        </div>
        <div className='up'>
          <h1>Completed</h1>
          <h2>{gamesCompleted}</h2>
        </div>
        <div className='up'>
          <h1>Win %</h1>
          {winPercentage ? <h2>{winPercentage}</h2> : <h2>0</h2>}
        </div>
        <div className='up'>
          <h1> Current Streak </h1>
          <h2>{currentWinStreak}</h2>
        </div>
        <div className='up'>
          <h1> Max Streak </h1>
          <h2>{maxWinStreak}</h2>
        </div>
      </div>
      <div className='stats'>
        <h1> Overall Statistics </h1>
      </div>
      <div className='distro'>
        <table>
          <tbody>
            {allObjects.map((stat, index) => {
              let barWidth = stat[0] === 0 ? '4' : (Math.floor((stat[0] / gamesPlayed) * 80) + 8).toString();
              let barColor = stat[1] === 1 ? 'green' : 'rgb(107,107,109';
              console.log(stat);
              console.log(index);
              console.log(barWidth);
              console.log(barColor);
              return (
                <tr id='guesses' key={index + 1}>
                  <td id='guess'>{index + 1}</td>
                  <td id='val'>
                    <div
                      className='chart'
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: `${barColor}`,
                      }}>
                      {stat[0]}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default DataAnalytics;
