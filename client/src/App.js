import React, { useState } from 'react';
import './App.css';

function App() {
  const [ name, setName ] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setName(e.target.name.value);
  };

  const inner = (() => {
    if (name.length < 1)
      return (
        <form onSubmit={handleSubmit}>
          <p><input className="input is-primary is-large my-2" type="text" name="name" placeholder="What's your name?" /></p>
          <p><input className="button is-primary is-large mt-2" type="submit" value="Join!" /></p>
        </form>
      );
    else
      return 'Waiting to start the game';
  })();

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="is-size-1 mb-2">Bomberman</h1>
        {inner}
      </header>
    </div>
  );
}

export default App;
