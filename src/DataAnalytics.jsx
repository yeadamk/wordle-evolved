import { useEffect, useState } from 'react';
import axios from 'axios';

function DataAnalytics( {uid} ){
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

    useEffect(() => {
        (async () => {
          const response = await axios.get(`http://localhost:4000/api/gethistory/${uid}`);
          setData(response.data);
        })();
    }, []);

    useEffect(() => {
        if (data){
            
            const ones = data.filter((item) => item.guesses.length === 1).length;
            const twos = data.filter((item) => item.guesses.length === 2).length;
            const threes = data.filter((item) => item.guesses.length === 3).length;
            const fours = data.filter((item) => item.guesses.length === 4).length;
            const fives = data.filter((item) => item.guesses.length === 5).length;
            const sixes = data.filter((item) => item.guesses.length === 6).length;
            const totalG = data.map((item) => item.guesses.length).reduce((acc, guesses) => acc+guesses, 0);
            const totalLengthOfAllTargetWords = data.map((item) => item.targetWord.length).reduce((acc, wordLength) => acc+wordLength, 0);
            const numberWins = data.filter((item) => item.playerWon == true).length;
            const numberLosses = data.filter((item) => item.playerWon == false).length;
            const averageTargetWordLen = totalLengthOfAllTargetWords / data.length;
            const averageG = totalG / data.length;
            const winPer = (numberWins / data.length) * 100;

            let tmpCurrWS = 0;
            let maxWS = 0;

            let currWS = 0;
            let keepIncrementing = true;

            data.forEach((item) => {
                if(item.playerWon) {
                    tmpCurrWS++;
                    maxWS = Math.max(tmpCurrWS, maxWS);
                } else {
                    tmpCurrWS = 0
                }
            });

            data.forEach((item) => {
                if(item.playerWon && keepIncrementing) {
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
        }
    }, [data]);
    
    return (
        null
    );  
}

export default DataAnalytics;