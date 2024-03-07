import './Card.css';
import { Link } from 'react-router-dom';

function SignUp({ setName, setEmail, setPassword, handleNewUsers }) {
  return (
    <>
      <div className='label-container'>
        <div className='label'>
          <label>Name:</label>
          <input onChange={(e) => setName(e.target.value)} type='text'></input>
        </div>
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
        <button className='auth-button' onClick={handleNewUsers}>
          Sign up
        </button>
      </Link>
    </>
  );
}

export default SignUp;
