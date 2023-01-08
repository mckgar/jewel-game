import { useEffect, useState } from 'react';
import './App.css';
import Gameboard from './components/Gameboard';
import Scoreboard from './components/Scoreboard';

function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('highScore')) || 0);

  const increaseScore = add => {
    setScore(s => s + add);
  }

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', highScore);
    }
  }, [score])

  return (
    <div className="App">
      <Scoreboard score={score} highScore={highScore} />
      <Gameboard width={8} increaseScore={increaseScore} />
    </div>
  );
}

export default App;
