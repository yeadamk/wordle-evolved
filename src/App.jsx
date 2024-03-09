import './App.css';
import Auth from './Auth';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GamePlay from './GamePlay';
import History from './History';

function App() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');

  return (
    <Router>
      <Routes>
        <Route path='/auth' element={<Auth setUserId={setUserId} setUserName={setUserName} />} />
        <Route path='/gameplay' element={<GamePlay userId={userId} userName={userName} />} />
        <Route path='/history' element={<History uid={userId} userName={userName} />} />
      </Routes>
    </Router>
  );
}

export default App;
