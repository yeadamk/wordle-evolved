import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, addDoc, getDocs, orderBy, where, query } from 'firebase/firestore';
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
    const q = await query(collection(db, 'users'), where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      res.send(doc.data());
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
  const currentDate = new Date();
  const length = targetWord.length;
  const numGuesses = Object.keys(guesses).length;

  try {
    const historyObj = {
      guesses: guesses,
      colors: colors,
      targetWord: targetWord,
      playerWon: playerWon,
      uid: uid,
      length: length,
      numGuesses: numGuesses,
      date: currentDate.toISOString(),
    };
    const docRef = await addDoc(collection(db, 'history'), historyObj);
    console.log('Document written with ID: ', docRef.id);
    res.send(docRef);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
});

app.use('/api/gethistory/:uid', async (req, res) => {
  const uid = req.params.uid;

  try {
    const q = await query(collection(db, 'history'), where('uid', '==', uid), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const history = [];
    querySnapshot.forEach((doc) => {
      history.push(doc.data());
    });

    res.send(history);
  } catch (error) {
    const errorMessage = error.message;
    console.log(errorMessage);
    res.send(errorMessage);
  }
});

app.use('/api/search/:uid', async (req, res) => {
  const uid = req.params.uid;
  const filter = req.query.filter; // Access additional parameter 1
  let filterContent = req.query.filterContent.toUpperCase();

  try {
    const q = await query(collection(db, 'history'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    const history = [];
    querySnapshot.forEach((doc) => {
      history.push(doc.data());
    });

    if (filter == 'playerWon' && filterContent == 'WON') {
      filterContent = 'true';
    } else if (filter == 'playerWon' && filterContent == 'LOST') {
      filterContent = 'false';
    }

    let filteredHistory;
    if (filter == 'date') {
      filteredHistory = await history.filter((br) => {
        let seconds = 0;
        const dateObject = new Date(Date.parse(br.date));
        if (br.date.seconds) {
          seconds = br.date.seconds;
        } else {
          seconds = Math.floor(dateObject.getTime() / 1000);
        }

        return String(new Date(seconds * 1000).toLocaleDateString('en-US')).includes(filterContent);
      });
    } else {
      filteredHistory = await history.filter((br) => String(br[filter]).includes(filterContent));
    }
    console.log(filteredHistory);
    res.send(filteredHistory);
  } catch (error) {
    const errorMessage = error.message;
    console.log(errorMessage);
    res.send(errorMessage);
  }
});

app.listen(4000, () => console.log('The server is running at PORT 4000'));
