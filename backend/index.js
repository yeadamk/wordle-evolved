import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, addDoc, getDocs, where, query } from 'firebase/firestore';
import express from 'express';
import cors from 'cors';
import { auth, db } from './firebase/firebaseConfig.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// API endpoint that handles regular user signin
app.use('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // console.log(user.uid);
    const q = await query(collection(db, 'users'), where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      res.send(doc.data());
      // console.log(doc.id, ' => ', doc.data());
    });
  } catch (error) {
    const errorMessage = error.message;
    console.log(errorMessage);
    res.send(errorMessage);
  }
});

// API endpoint that handles regular user signup
app.use('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userObj = {
      name: name,
      email: user.email,
      uid: user.uid,
    };

    // This code was from chatGpt: the prompt was "how do i use firebase auth along with firestore"
    console.log(user.uid);

    try {
      const docRef = await addDoc(collection(db, 'users'), userObj);
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    res.send(userObj);
  } catch (error) {
    const errorMessage = error.message;
    console.log(errorMessage);
    res.send(errorMessage);
  }
});

app.use('/api/addhistory', async (req, res) => {
  const { guesses, colors, targetWord, playerWon, uid } = req.body;
  try {
    const historyObj = {
      guesses: guesses,
      colors: colors,
      targetWord: targetWord,
      playerWon: playerWon,
      uid: uid,
    };
    const docRef = await addDoc(collection(db, 'history'), historyObj);
    console.log('Document written with ID: ', docRef.id);
    res.send(docRef);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
});

app.listen(4000, () => console.log('The server is running at PORT 4000'));
