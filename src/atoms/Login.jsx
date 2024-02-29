import './Card.css';

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
      <button className='auth-button' onClick={signInReturningUser}>
        Sign In
      </button>
      <button className='auth-button' onClick={handleGoogleClick}>
        sign in with google
      </button>
    </>
  );
}

export default Login;
