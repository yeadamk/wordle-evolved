import { auth } from '../firebase/firebaseConfig';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import './Auth.css';
import { useState } from 'react';
import Login from './atoms/Login';
import SignUp from './atoms/SignUp';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authToggle, setAuthToggle] = useState(false);

  const provider = new GoogleAuthProvider();

  const signInReturningUser = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewUsers = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleClick = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='login-container'>
      <div className='toggle-container'>
        <button className={`toggle toggle-left ${authToggle ? 'sel' : ''}`} onClick={() => setAuthToggle(true)}>
          Sign In
        </button>
        <button className={`toggle toggle-right ${authToggle ? '' : 'sel'}`} onClick={() => setAuthToggle(false)}>
          Sign Up
        </button>
      </div>
      {authToggle ? (
        <Login
          setEmail={setEmail}
          setPassword={setPassword}
          handleGoogleClick={handleGoogleClick}
          signInReturningUser={signInReturningUser}
        />
      ) : (
        <SignUp setName={setName} setEmail={setEmail} setPassword={setPassword} handleNewUsers={handleNewUsers} />
      )}
    </div>
  );
}
export default Auth;
