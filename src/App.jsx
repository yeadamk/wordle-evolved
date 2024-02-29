import './App.css';
import Auth from './Auth';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GamePlay from './GamePlay';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/auth' element={<Auth />} />
        <Route path='/gameplay' element={<GamePlay />} />
      </Routes>
    </Router>
  );
}

export default App;
