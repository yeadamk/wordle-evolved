import { auth } from '../firebase/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import './App.css';

function App() {
  const provider = new GoogleAuthProvider();
  const handleClick = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
      console.log(user);
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    } catch (error) {
      // Handle Errors here.
      const credential = GoogleAuthProvider.credentialFromError(error);

      console.log(credential);
    }
  };

  return (
    <>
      <div>HELLO WORLD!!</div>
      <button onClick={handleClick}>sign in with google</button>
    </>
  );
}

export default App;
