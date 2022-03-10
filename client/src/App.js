import React, { useEffect, useState } from 'react';
import './App.css';

import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log('Connected!');
});

socket.on("disconnect", () => {
  console.log('Disconnected!');
});

let outerState = {};
socket.on("state", (arg) => {
  outerState = arg;
});

let joined = false;

function App() {
  const [ name, setName ] = useState('');
  const [ state, setState ] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setName(e.target.name.value);

    socket.emit('join', e.target.name.value);
    joined = true;
  };

  useEffect(() => {
    const idx = setInterval(() => setState(outerState), 100);
    return () => clearInterval(idx);
  });

  const inner = (() => {
    if (name.length < 1)
      return (
        <form onSubmit={handleSubmit}>
          <p><input className="input is-primary is-large my-2" type="text" name="name" placeholder="What's your name?" /></p>
          <p><input className="button is-primary is-large mt-2" type="submit" value="Join!" /></p>
        </form>
      );
    else
      return `${JSON.stringify(state)}`;
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

let pressed = 0;
document.addEventListener('keyup', e => {
  if (pressed === e.keyCode)
    pressed = 0;
});
document.addEventListener('keydown', e => {
  if ((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode === 32)
    pressed = e.keyCode;
});
let blocked = 0;
const setBlock = () => {
  blocked = 1;
  setTimeout(() => { blocked = 0; }, 300);
}
setInterval(() => {
  if (!joined || blocked > 0)
    return;

  if (pressed === 37) {
    setBlock();
    socket.emit('key', 'left');
  } else if (pressed === 38) {
    setBlock();
    socket.emit('key', 'up');
  } else if (pressed === 39) {
    setBlock();
    socket.emit('key', 'right');
  } else if (pressed === 38) {
    setBlock();
    socket.emit('key', 'down');
  } else if (pressed === 32) {
    setBlock();
    socket.emit('key', 'space');
  }
}, 100);

export default App;
