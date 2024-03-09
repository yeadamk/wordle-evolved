import './LandingPage.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LandingPage({ isSignedIn }) {
    const navigate = useNavigate();

    const signInClickRedirect = () =>{
        if(isSignedIn) {
            navigate("/gameplay");
        } else{
            navigate("/auth");
        }
    }
    return( 
        <div className="landing-container">
            <h1 className="title">Welcome to Wordle-Evolved</h1>
            <p className="description">In this game, you will have to guess a randomly selected 5 letter word in 6 guesses. If a square is green,
            you guessed the correct position of a letter in the word. If a square is yellow, it means you guessed a letter that is in the word but
            not in the correct spot. If the square does not change color, the letter is not in the word.
            You can also modify the number of guesses, the length of the word to guess, and more. To see your history and data analytics on
            games, please select the associated buttons after you are logged in. Have fun!</p>
            <button className="signin-button" onClick={signInClickRedirect}>Login/Sign Up</button>
        </div>
    );
}

export default LandingPage;