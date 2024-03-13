import React from "react";
import "./Header.css"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket,faUser,faKeyboard } from '@fortawesome/free-solid-svg-icons';

function Header({ userId, userName }){
    return (
        <>
            <header>
                <div class="inline">
                    <section class="buttons">
                        {userId ? (
                            <>
                                <Link to='/gameplay' className="link">
                                    <FontAwesomeIcon icon={faKeyboard} size='2x' class='fa-fw'/>
                                </Link>
                            </>
                        ) : (
                            <>
                                <h1>Sign In</h1>
                                <Link to='/auth'>
                                    <button>
                                        {/*onClick={() => }*/}
                                        Sign In
                                    </button>
                                </Link>
                            </>
                        )}
                    </section>
                    <section class="name">
                        <Link to='/gameplay'>
                            <h1>Wordle Evolved</h1>
                        </Link>
                    </section>
                    <section class="sign">
                        {userId ? (
                                <>  <div>
                                        <Link to='/history' className="link">
                                            <FontAwesomeIcon icon={faUser} size='1x' class='fa-fw'/>
                                        </Link>

                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faRightFromBracket} size='1x' class='fa-fw' margin-left='10px'/>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to='/auth'>
                                        <button>Sign In</button>
                                    </Link>
                                </>
                            )}
                    </section>
                </div>
                {/*<h1>ok?</h1>*/}
                <div class="h_line"></div>
            </header>
        </>
    );
}

export default Header;