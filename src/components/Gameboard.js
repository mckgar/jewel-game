import { useEffect, useState } from "react";
import './Gameboard.css';

const Gameboard = () => {
  const PIECES = ['WHITE', 'RED', 'BLUE', 'GREEN', 'PURPLE', 'ORANGE', 'YELLOW'];
  const WIDTH = 8;
  const [board, setBoard] = useState([]);
  const [display, setDisplay] = useState(null);
  const [select, setSelect] = useState(null);

  /* Initial populate */
  useEffect(() => {
    const newBoard = [];
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      let piece = PIECES[Math.random() * PIECES.length | 0];
      /* No successes at spawn */
      while (
        ((i % WIDTH) > 1 && piece === newBoard[i - 1] && piece === newBoard[i - 2])
        || (piece === newBoard[i - 10] && piece === newBoard[i - 20])
      ) {
        piece = PIECES[Math.random() * PIECES.length | 0];
      }
      newBoard.push(piece);
    }
    setBoard(newBoard);
  }, []);

  /* draw board */
  useEffect(() => {
    setDisplay(board.map((piece, index) => {
      return <div
        key={index}
        id={index}
        className={`board-piece ${piece} ${select === index}`}
        onClick={e => handleClick(e)}
      ></div>;
    }));

    const handleClick = e => {
      const clicked = parseInt(e.target.id);
      const selected = parseInt(select);
      if (clicked === selected - 1 && (clicked % WIDTH) !== WIDTH - 1) {
        let temp = [
          ...board.slice(0, selected - 1),
          board[selected], board[selected - 1],
          ...board.slice(selected + 1)
        ];
        setBoard(temp);
        setSelect(null);
      } else if (clicked === selected + 1 && (clicked % WIDTH) !== 0) {
        let temp = [
          ...board.slice(0, selected),
          board[selected + 1], board[selected],
          ...board.slice(selected + 2)
        ];
        setBoard(temp);
        setSelect(null);
      } else if (clicked === selected + WIDTH) {
        let temp = [
          ...board.slice(0, selected),
          board[selected + WIDTH],
          ...board.slice(selected + 1, selected + WIDTH),
          board[selected],
          ...board.slice(selected + WIDTH + 1)
        ];
        setBoard(temp);
        setSelect(null);
      } else if (clicked === selected - WIDTH) {
        let temp = [
          ...board.slice(0, selected - WIDTH),
          board[selected],
          ...board.slice(selected - WIDTH + 1, selected),
          board[selected - WIDTH],
          ...board.slice(selected + 1)
        ];
        setBoard(temp);
        setSelect(null);
      } else {
        setSelect(clicked);
      }
    };

  }, [board, select]);

  return (
    <div id='gameboard'>
      {display}
    </div>
  )
}

export default Gameboard;
