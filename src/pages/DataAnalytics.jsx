import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from './atoms/Header';
import '../styles/DataAnalytics.css';


function DataAnalytics({ uid, userName }) {

  {/*Declare all state variables */}
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
  const [customObjects, setCustomObjects] = useState([]);
  const [allWords, setWords] = useState([]);
  const [dailyGameVals, setDGVals]= useState([]);
  const [customGameVals, setCGVals] = useState([]);
  const [customWords, setCustomWords] = useState([]);

  {/*Get all the data */}
  useEffect(() => {
    (async () => {
      const response = await axios.get(`http://localhost:4000/api/gethistory/${uid}`);
      setData(response.data);
    })();
  }, []);

  useEffect(() => {
    if (data) {
      {/*Set all state variables*/}
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
      const averageTargetWordLen = (totalLengthOfAllTargetWords / data.length).toFixed(2);
      const averageG = (totalG / data.length).toFixed(2);
      const winPer = ((numberWins / data.length) * 100).toFixed(2);
      const gamesCompleted = numberWins + numberLosses;
      {/* Calculate Streaks + Get Last Won */}
      let tmpCurrWS = 0;
      let maxWS = 0;

      let currWS = 0;
      let keepIncrementing = true;
      
      let last = 0;
      let allIndex = new Array(6).fill(0);
      /*let guesses = [numOnes, numTwos, numThrees, numFours, numFives, numSixes];*/
      let zip = (a1, a2) => a1.map((x, i) => [x, a2[i]]);
      

      data.forEach((item) => {
        if (item.playerWon) {
          tmpCurrWS++;
          maxWS = Math.max(tmpCurrWS, maxWS);
          if(last === 0){
            last = item.numGuesses;
          }
          /*console.log(item);*/
        } else {
          tmpCurrWS = 0;
        }
      });

      if (last > 0 && last < 7) {
        allIndex.splice(last - 1, 0, 1);
      }

      data.forEach((item) => {
        if (item.playerWon && keepIncrementing) {
          currWS++;
        } else {
          keepIncrementing = false;
        }
      });
      /*console.log("------");*/
      {/*
      let displayNumber = 5;

      function changeDisplay (displayNumberPassed) {
        displayNumber = displayNumberPassed;
      };
    */} 
      {/* HANLDE DG VALUELS */}
      let tmpCurrWSDaily = 0;
      let keepIncrementingDaily = true;
      let maxWSDaily = 0;
      let words = [];
      let occurences = [];
      let dg = [0,0,0,0,0,0,0];
      data.forEach((item) => {
        if(item.length === 5){
          /*console.log(item);*/
          /*console.log(Object.values(item.guesses));*/
          dg[0] += 1;
          dg[5] += item.numGuesses;
          if(item.playerWon === true){
            dg[1] += 1;
          }
          for(let i = 0; i<(Object.values(item.guesses)).length;i++){
            /*console.log(i);*/
            let word = Object.values(item.guesses)[i];
            /*let word = Object.values(guesses)[i];*/
            /*console.log(word);*/
            if(words.includes(word)){
              occurences[words.indexOf(word)] += 1;
            } else{
              words.push(word);
              occurences[words.indexOf(word)] = 1;
            }
          }

          if (item.playerWon) {
            tmpCurrWSDaily ++;
            dg[4] = Math.max(tmpCurrWSDaily, dg[4]);
          } else {
            tmpCurrWSDaily = 0;
          }

          if (item.playerWon && keepIncrementingDaily) {
            dg[3] ++;
          } else {
            keepIncrementingDaily = false;
          }

          /*console.log((Object.values(guesses)).length);*/
          /*console.log(Object);*/
          /*** */
        }
      })
      dg[2] = (dg[1]/parseFloat(dg[0])).toFixed(2);
      dg[6] = (dg[5]/parseFloat(dg[0])).toFixed(2);

      {/* HANLDE CUSTOM VALS */}
      let tmpCurrWSCustom = 0;
      let keepIncrementingCustom = true;
      let maxWSCustom = 0;
      let wordsCustom = [];
      let occurencesCustom = [];
      let cg = [0,0,0,0,0,0,0];
      let winsCustom = new Array(15).fill(0);
      data.forEach((item) => {
        if(item.length !== 5){
          /*console.log(item);*/
          /*console.log(Object.values(item.guesses));*/
          cg[0] += 1;
          cg[5] += item.numGuesses;
          if(item.playerWon === true){
            cg[1] += 1;
            winsCustom[item.length] += 1;
            console.log("haha");
          }
          for(let i = 0; i<(Object.values(item.guesses)).length;i++){
            /*console.log(i);*/
            let word = Object.values(item.guesses)[i];
            /*let word = Object.values(guesses)[i];*/
            /*console.log(word);*/
            if(wordsCustom.includes(word)){
              occurencesCustom[wordsCustom.indexOf(word)] += 1;
            } else{
              wordsCustom.push(word);
              occurencesCustom[wordsCustom.indexOf(word)] = 1;
            }
          }

          if (item.playerWon) {
            tmpCurrWSCustom ++;
            cg[4] = Math.max(tmpCurrWSCustom, cg[4]);
          } else {
            tmpCurrWSCustom = 0;
          }

          if (item.playerWon && keepIncrementingCustom) {
            cg[3] ++;
          } else {
            keepIncrementingCustom = false;
          }

          /*console.log((Object.values(guesses)).length);*/
          /*console.log(Object);*/
          /*** */
        }
      })
      cg[2] = (cg[1]/parseFloat(cg[0])).toFixed(2);
      cg[6] = (cg[5]/parseFloat(cg[0])).toFixed(2);

      {/*Set vals in states*/}
      setDGVals(dg);
      setCGVals(cg);
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
      setObjects(zip([ones, twos, threes, fours, fives, sixes], allIndex));
      setCustomObjects(winsCustom);
      setWords(zip(words,occurences).sort((a,b) => b[1] - a[1]).slice(0,10))
      setCustomWords(zip(wordsCustom,occurencesCustom).sort((a,b) => b[1] - a[1]).slice(0,10))

      console.log('DG', dg);
      console.log('Games played: ', gamesPlayed);
      console.log('Total guesses: ', totalGuesses);
      console.log('Average guesses: ', averageGuesses);
      console.log('Total wins: ', totalWins);
      console.log('Total losses: ', totalLosses);
      console.log('Win percentage: ', winPercentage);
      console.log('Current win streak: ', currentWinStreak);
      console.log('Max win streak: ', maxWinStreak);
      console.log("total length:", totalLengthOfAllTargetWords);
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
      console.log('Occurences: ', occurences);
      console.log('Words', words);
      console.log('All Worlds', allWords);
      console.log('custom', customObjects);
    
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
          <h2>{totalWins}</h2>
        </div>
        <div className='up'>
          <h1>Win(%)</h1>
          {winPercentage ? <h2>{winPercentage}</h2> : <h2>0</h2>}
        </div>
        <div className='up'>
          <h1>Current Streak</h1>
          <h2>{currentWinStreak}</h2>
        </div>
        <div className='up'>
          <h1>Max Streak</h1>
          <h2>{maxWinStreak}</h2>
        </div>
        <div className='up'>
          <h1> Average Game Length </h1>
          <h2>{averageGuesses}</h2>
        </div>
        <div className='up'>
          <h1> Average Target Word Length </h1>
          <h2>{averageTargetWordLength}</h2>
        </div>
      </div>
      <div className='stats'>
        <h1>Daily Game Statistics</h1>
      </div>
      <div className='stats-box'>
        <div className='up'>
          <h1>Played</h1>
          <h2>{dailyGameVals[0]}</h2>
        </div>
        <div className='up'>
          <h1>Completed</h1>
          <h2>{dailyGameVals[1]}</h2>
        </div>
        <div className='up'>
          <h1>Win %</h1>
          {dailyGameVals[2] ? <h2>{dailyGameVals[2]}</h2> : <h2>0</h2>}
        </div>
        <div className='up'>
          <h1> Current Streak </h1>
          <h2>{dailyGameVals[3]}</h2>
        </div>
        <div className='up'>
          <h1> Max Streak </h1>
          <h2>{dailyGameVals[4]}</h2>
        </div>
        <div className='up'>
          <h1> Average Game Length </h1>
          <h2>{dailyGameVals[6]}</h2>
        </div>
      </div>
      <div id="titles">
        <h1>
          <u>Guess Distribution</u>
        </h1>
        <h1>
          <u>Most Common Words Guessed</u>
        </h1>
      </div>
      <div id="dailystats">
        <div className='distro'>
          <table>
            <tbody>
              {allObjects.map((stat, index) => {
                let barWidth = stat[0] === 0 ? '4' : (Math.floor((stat[0] / dailyGameVals[0]) * 80) + 8).toString();
                let barColor = stat[1] === 1 ? 'green' : 'rgb(102,102,102)';
                return (
                  <tr id='guesses' key={index + 1}>
                    <td id='guess'>{index + 1}</td>
                    <td id='val'>
                      <div
                        className='chart'
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: `${barColor}`
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
        <div className='words'>
          <div id="list">
              <table>
                <tbody>
                  <tr id="header">
                    <th width="50%">Word</th>
                    <th width="50%">Occurences</th>
                  </tr>
                  {allWords.map((word,occurence) =>{
                    return(
                      <tr key={occurence}>
                        <td width="50%">{word[0]}</td>
                        <td width="50">{word[1]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
          </div>
        </div>
      </div>
      <div className='stats'>
        <h1> Custom Game Statistics</h1>
      </div>
      <div className='stats-box'>
        <div className='up'>
          <h1>Played</h1>
          <h2>{customGameVals[0]}</h2>
        </div>
        <div className='up'>
          <h1>Completed</h1>
          <h2>{customGameVals[1]}</h2>
        </div>
        <div className='up'>
          <h1>Win %</h1>
          {customGameVals[2] ? <h2>{customGameVals[2]}</h2> : <h2>0</h2>}
        </div>
        <div className='up'>
          <h1> Current Streak </h1>
          <h2>{customGameVals[3]}</h2>
        </div>
        <div className='up'>
          <h1> Max Streak </h1>
          <h2>{customGameVals[4]}</h2>
        </div>
        <div className='up'>
          <h1> Average Game Length </h1>
          <h2>{customGameVals[6]}</h2>
        </div>
      </div>
      <div id="titles">
        <h1>
          Guess Distribution
        </h1>
        <h1>
          Most Common Words Guessed
        </h1>
      </div>
      <div id="dailystats">
        <div className='distro'>
          <table>
            <tbody>
              {customObjects.map((stat, index) => {
                let barWidth = stat === 0 ? '4' : (Math.floor((stat / customGameVals[0]) * 80) + 8).toString();
                let barColor = 'rgb(102,102,102)';
                return (
                  <tr id='guesses' key={index + 1}>
                    <td id='guess'>{index + 1}</td>
                    <td id='val'>
                      <div
                        className='chart'
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: `${barColor}`
                        }}>
                        {stat}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className='words'>
          {/*
          <div id="options">
            <button onClick={() => changeDisplay(5)}>5</button>
            <button onClick={() => changeDisplay(25)}>25</button>
            <button onClick={() => changeDisplay(100)}>100</button>
          </div>
          */}
          <div id="list">
              <table>
                <tbody>
                  <tr id="header">
                    <th width="50%">Word</th>
                    <th width="50%">Occurences</th>
                  </tr>
                  {customWords.map((word,occurence) =>{
                    return(
                      <tr key={occurence}>
                        <td width="50%">{word[0]}</td>
                        <td width="50">{word[1]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default DataAnalytics;
