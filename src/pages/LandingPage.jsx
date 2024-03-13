import '../styles/LandingPage.css';
import { useNavigate } from 'react-router-dom';

function LandingPage({ isSignedIn }) {
  const navigate = useNavigate();

  const signInClickRedirect = () => {
    if (isSignedIn) {
      navigate('/gameplay');
    } else {
      navigate('/auth');
    }
  };
  return (
    <div className='landing-page-container'>
      <h1 className='title'>
        Welcome to <nobr>Wordle&ndash;Evolved</nobr>
      </h1>
      <h2 className='subtitle'>An expansion of the game 'Wordle'</h2>
      <p className='description'>
        This game expands upon the game of Wordle, where you are given six guesses to guess a five-letter word. In
        addition to the basic game, the user is able to modify the number of guesses, the length of the word to guess,
        restricted word selection, and more. To see your history and data analytics on games, please select the
        associated buttons after you are logged in. Have fun!
      </p>
      {isSignedIn ? (
        <button className='signin-button' onClick={signInClickRedirect}>
          Start
        </button>
      ) : (
        <button className='signin-button' onClick={signInClickRedirect}>
          Login/Sign Up
        </button>
      )}
    </div>
  );
}

export default LandingPage;
