import React from 'react';
import './Header.css';

function Header({ userId, userName }) {
  return (
    <>
      <header>
        <div class='inline'>
          <section>
            {userId ? (
              <>
                <h1>User: {userName}</h1>
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
          <section class='name'>Wordle Evolved</section>
          <section class='sign'>
            {userId ? (
              <>
                <h1>Sign Out</h1>
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
        <div class='h_line'></div>
      </header>
    </>
  );
}

export default Header;
