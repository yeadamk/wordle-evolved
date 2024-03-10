import React, { useState } from 'react';
import './DropdownMenu.css'; // Import your CSS file
import './History.css';
import axios from 'axios';

function HistoryLegend({ uid, filter, setFilter, setFilterContent, filterContent, setHistory, history }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setFilterContent(event.target.value);
  };
  const dropDownClick = (clickedFilter) => {
    setFilter(clickedFilter);
    setDropdownOpen(!isDropdownOpen);
  };

  const onSearch = async () => {
    console.log('clicked');
    const response = await axios.get(
      `http://localhost:4000/api/search/${uid}?filter=${filter}&filterContent=${filterContent}`,
    );
    setHistory(response.data);
  };

  return (
    <>
      {/* We want to have filtering capabilities for Result, Date, length, guesses, targetWord*/}
      <div className='search'>
        <label>Search: </label>
        <input type='text' id='myInput' onChange={handleInputChange} />

        <div className='dropdown-container'>
          <button className='toggle-button' onClick={toggleDropdown}>
            {filter ? `${filter} ▼` : `Filter ▼`}
          </button>
          {isDropdownOpen && (
            <div className='dropdown-menu'>
              <span onClick={() => dropDownClick('playerWon')}>Result</span>
              <span onClick={() => dropDownClick('date')}>Date</span>
              <span onClick={() => dropDownClick('gength')}>Length</span>
              <span onClick={() => dropDownClick('numGuesses')}>Guesses</span>
              <span onClick={() => dropDownClick('targetWord')}>Word</span>
            </div>
          )}
          <button
            className='toggle-button'
            onClick={() => {
              if (filter) {
                setFilterContent(inputValue);
                onSearch();
              }
            }}>
            {filter ? 'SUBMIT' : 'SELECT A FILTER'}
          </button>
        </div>
      </div>

      <div className='history-container'>
        <p className='history-legend-board'>Game Board</p>
        <div className='history-container-right'>
          <p>Length</p>
          <p>Guesses</p>
          <p>TargetWord</p>
          <p>Result</p>
          <p>Date</p>
        </div>
      </div>
    </>
  );
}

export default HistoryLegend;
