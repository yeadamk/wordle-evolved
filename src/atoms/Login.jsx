import './Card.css';
import { Link } from 'react-router-dom';

function Login({ setEmail, setPassword, handleGoogleClick, signInReturningUser }) {
  return (
    <>
      <div className='label-container'>
        <div className='label'>
          <label>Email Address:</label>
          <input onChange={(e) => setEmail(e.target.value)} type='text'></input>
        </div>
        <div className='label'>
          <label>Password:</label>
          <input onChange={(e) => setPassword(e.target.value)} type='password'></input>
        </div>
      </div>

      <Link to='/gameplay'>
        <button className='auth-button' onClick={signInReturningUser}>
          Sign In
        </button>
      </Link>
    </>
  );
}

export default Login;
