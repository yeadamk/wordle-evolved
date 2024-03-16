import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faUser, faKeyboard, faChartSimple } from '@fortawesome/free-solid-svg-icons';

function Header({ userId, userName }) {
  return (
    <>
      <header>
        <div className='inline'>
          <section className='buttons'>
            {userId ? (
              <>
                <Link to='/gameplay' className='link'>
                  <FontAwesomeIcon icon={faKeyboard} class='fa-fw fa-2xl' />
                </Link>
              </>
            ) : (
              <>
              {/* If the user is not logged in, display nothing */}
              </>
            )}
          </section>
          <h1 className='title'>
            <Link to='/'>Wordle Evolved</Link>
          </h1>
          <section class='sign'>
            {userId ? (
              <>
                {' '}
                <div>
                  <Link to='/dataanalytics' className='link'>
                    <FontAwesomeIcon icon={faChartSimple} size='2x' class='fa-fw fa-xl' />
                  </Link>
                </div>
                <div>
                  <Link to='/history' className='link'>
                    <FontAwesomeIcon icon={faUser} size='2x' class='fa-fw fa-xl' />
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* If the user is not logged in, display nothing */}
              </>
            )}
          </section>
        </div>
        {/*<h1>ok?</h1>*/}
        <div class='h_line'></div>
      </header>
    </>
  );
}

export default Header;
