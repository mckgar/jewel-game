import './Scoreboard.css'

const Scoreboard = props => {
  return (
    <div className="score-board">
      <div id='high-score-panel'>
        <div className='high-score-label'>HIGH SCORE</div>
        <div className="high-score">{props.highScore}</div>
      </div>
      <div id='score-panel'>
        <div className='score-label'>SCORE</div>
        <div className="current-score">{props.score}</div>
      </div>
    </div>
  )
}

export default Scoreboard;
