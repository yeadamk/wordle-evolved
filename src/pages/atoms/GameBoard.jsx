import './History.css';

function GameBoard({ gameHistory, wordLength }) {
  return (
    <div className='board'>
      {gameHistory.map((item, index) => {
        const color = {
          2: 'green',
          1: 'yellow',
          0: 'gray',
        };
        const colorClass = color[item[1]];

        if (index == 0) {
          return <span className={colorClass}>{item[0]}</span>;
        } else if (index != 0 && index % wordLength == 0) {
          return (
            <>
              <div className='break' />
              <span className={colorClass}>{item[0]}</span>
            </>
          );
        } else {
          return <span className={colorClass}>{item[0]}</span>;
        }
      })}
    </div>
  );
}

export default GameBoard;
