import { useEffect, useState } from "react";
import './Gameboard.css';

const Gameboard = props => {
  const PIECES = ['WHITE', 'RED', 'BLUE', 'GREEN', 'PURPLE', 'ORANGE', 'YELLOW'];
  const WIDTH = props.width || 8;
  const [board, setBoard] = useState([]);
  const [display, setDisplay] = useState(null);
  const [select, setSelect] = useState(null);
  const [started, setStarted] = useState(false);

  /* Initial populate */
  useEffect(() => {
    const newBoard = [];
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      let piece = PIECES[Math.random() * PIECES.length | 0];
      /* No successes at spawn */
      while (
        ((i % WIDTH) > 1 && piece === newBoard[i - 1] && piece === newBoard[i - 2])
        || (piece === newBoard[i - WIDTH] && piece === newBoard[i - WIDTH * 2])
      ) {
        piece = PIECES[Math.random() * PIECES.length | 0];
      }
      newBoard.push(piece);
    }
    setBoard(newBoard);
    setStarted(true);
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
      // Swap with left neighbor
      if (clicked === selected - 1 && (clicked % WIDTH) !== WIDTH - 1) {
        // Can only swap if a score can happen 
        const scores = (
          (selected % WIDTH > 2 && board[selected] === board[clicked - 1] && board[selected] === board[clicked - 2])
          || (selected % WIDTH < WIDTH - 2 && board[clicked] === board[selected + 1] && board[clicked] === board[selected + 2])
          || ((selected / WIDTH | 0) > 1 && board[selected] === board[clicked - WIDTH] && board[selected] === board[clicked - WIDTH * 2])
          || ((selected / WIDTH | 0) > 1 && board[clicked] === board[selected - WIDTH] && board[clicked] === board[selected - WIDTH * 2])
          || ((selected / WIDTH | 0) < WIDTH - 2 && board[selected] === board[clicked + WIDTH] && board[selected] === board[clicked + WIDTH * 2])
          || ((selected / WIDTH | 0) < WIDTH - 2 && board[clicked] === board[selected + WIDTH] && board[clicked] === board[selected + WIDTH * 2])
          || ((selected / WIDTH | 0) > 0 && selected / WIDTH | 0 < WIDTH - 1 && board[selected] === board[clicked - WIDTH] && board[selected] === board[clicked + WIDTH])
          || ((selected / WIDTH | 0) > 0 && selected / WIDTH | 0 < WIDTH - 1 && board[clicked] === board[selected - WIDTH] && board[clicked] === board[selected + WIDTH])
        );
        if (scores) {
          let temp = [
            ...board.slice(0, selected - 1),
            board[selected], board[selected - 1],
            ...board.slice(selected + 1)
          ];
          setBoard(temp);
        }
        setSelect(null);
        // Swap with right neighbor
      } else if (clicked === selected + 1 && (clicked % WIDTH) !== 0) {
        // Can only swap if a score can happen 
        const scores = (
          (selected % WIDTH < WIDTH - 2 && board[selected] === board[clicked + 1] && board[selected] === board[clicked + 2])
          || (selected % WIDTH > 1 && board[clicked] === board[selected - 1] && board[clicked] === board[selected - 2])
          || ((selected / WIDTH | 0) > 1 && board[selected] === board[clicked - WIDTH] && board[selected] === board[clicked - WIDTH * 2])
          || ((selected / WIDTH | 0) > 1 && board[clicked] === board[selected - WIDTH] && board[clicked] === board[selected - WIDTH * 2])
          || ((selected / WIDTH | 0) < WIDTH - 2 && board[selected] === board[clicked + WIDTH] && board[selected] === board[clicked + WIDTH * 2])
          || ((selected / WIDTH | 0) < WIDTH - 2 && board[clicked] === board[selected + WIDTH] && board[clicked] === board[selected + WIDTH * 2])
          || ((selected / WIDTH | 0) > 0 && selected / WIDTH | 0 < WIDTH - 1 && board[selected] === board[clicked - WIDTH] && board[selected] === board[clicked + WIDTH])
          || ((selected / WIDTH | 0) > 0 && selected / WIDTH | 0 < WIDTH - 1 && board[clicked] === board[selected - WIDTH] && board[clicked] === board[selected + WIDTH])
        );
        if (scores) {
          let temp = [
            ...board.slice(0, selected),
            board[selected + 1], board[selected],
            ...board.slice(selected + 2)
          ];
          setBoard(temp);
        }
        setSelect(null);
        // Swap with bottom neighbor
      } else if (clicked === selected + WIDTH) {
        // Can only swap if a score can happen
        const scores = (
          ((selected / WIDTH | 0) < WIDTH - 3 && board[selected] === board[clicked + WIDTH] && board[selected] === board[clicked + WIDTH * 2])
          || ((selected / WIDTH | 0) > 1 && board[clicked] === board[selected - WIDTH] && board[clicked] === board[selected - WIDTH * 2])
          || (selected % WIDTH > 1 && board[selected] === board[clicked - 1] && board[selected] === board[clicked - 2])
          || (selected % WIDTH < WIDTH - 2 && board[selected] === board[clicked + 1] && board[selected] === board[clicked + 2])
          || (selected % WIDTH > 1 && board[clicked] === board[selected - 1] && board[clicked] === board[selected - 2])
          || (selected % WIDTH < WIDTH - 2 && board[clicked] === board[selected + 1] && board[clicked] === board[selected + 2])
          || (selected % WIDTH > 0 && selected % WIDTH < WIDTH - 1 && board[selected] === board[clicked - 1] && board[selected] === board[clicked + 1])
          || (selected % WIDTH > 0 && selected % WIDTH < WIDTH - 1 && board[clicked] === board[selected - 1] && board[clicked] === board[selected + 1])
        );
        if (scores) {
          let temp = [
            ...board.slice(0, selected),
            board[selected + WIDTH],
            ...board.slice(selected + 1, selected + WIDTH),
            board[selected],
            ...board.slice(selected + WIDTH + 1)
          ];
          setBoard(temp);
        }
        setSelect(null);
        // Swap with top neighbor
      } else if (clicked === selected - WIDTH) {
        // Can only swap if a score can happen
        const scores = (
          ((selected / WIDTH | 0) < WIDTH - 2 && board[clicked] === board[selected + WIDTH] && board[clicked] === board[selected + WIDTH * 2])
          || ((selected / WIDTH | 0) > 2 && board[selected] === board[clicked - WIDTH] && board[selected] === board[clicked - WIDTH * 2])
          || (selected % WIDTH > 1 && board[selected] === board[clicked - 1] && board[selected] === board[clicked - 2])
          || (selected % WIDTH < WIDTH - 2 && board[selected] === board[clicked + 1] && board[selected] === board[clicked + 2])
          || (selected % WIDTH > 1 && board[clicked] === board[selected - 1] && board[clicked] === board[selected - 2])
          || (selected % WIDTH < WIDTH - 2 && board[clicked] === board[selected + 1] && board[clicked] === board[selected + 2])
          || (selected % WIDTH > 0 && selected % WIDTH < WIDTH - 1 && board[selected] === board[clicked - 1] && board[selected] === board[clicked + 1])
          || (selected % WIDTH > 0 && selected % WIDTH < WIDTH - 1 && board[clicked] === board[selected - 1] && board[clicked] === board[selected + 1])
        );
        if (scores) {
          let temp = [
            ...board.slice(0, selected - WIDTH),
            board[selected],
            ...board.slice(selected - WIDTH + 1, selected),
            board[selected - WIDTH],
            ...board.slice(selected + 1)
          ];
          setBoard(temp);
        }
        setSelect(null);
        // No swap; reset selected
      } else {
        setSelect(clicked);
      }
    };

  }, [board, select, WIDTH]);

  /* Check for groups to pop (lines >= 3) */
  useEffect(() => {
    if (!started) return;
    const lines = [];
    // Horizontal check
    for (let i = 0; i < WIDTH; i++) {
      for (let j = 0; j < WIDTH - 2; j++) {
        const line = [WIDTH * i + j];
        if (board[line[0]] === 'NONE') continue;
        let r = WIDTH * i + j + 1;
        while (r % WIDTH !== 0 && board[r] !== 'NONE' && board[r] === board[line[0]]) {
          line.push(r);
          r++;
        }
        if (line.length >= 3) {
          lines.push(line);
          j = r - 1;
        }
      }
    }
    // Vertical check
    for (let i = 0; i < WIDTH; i++) {
      for (let j = 0; j < WIDTH - 2; j++) {
        const line = [WIDTH * j + i];
        if (board[line[0]] === 'NONE') continue;
        let r = WIDTH * (j + 1) + i;
        while (r < board.length && board[r] !== 'NONE' && board[r] === board[line[0]]) {
          line.push(r);
          r += WIDTH;
        }
        if (line.length >= 3) {
          lines.push(line);
          j = ((r - i) / WIDTH) - 1;
        }
      }
    }

    if(lines.length < 1) return;

    // Pop lines
    let temp = board;
    for (const line of lines) {
      for (const space of line) {
        temp = [...temp.slice(0, space), 'NONE', ...temp.slice(space + 1)];
      }
    }
    setBoard(temp);

    // Drop lines
    for (let i = 0; i < temp.length; i++) {
      if (i + WIDTH < temp.length && temp[i + WIDTH] === 'NONE') {
        for (let j = i + WIDTH; j >= 0; j -= WIDTH) {
          if (j > WIDTH) {
            temp = [...temp.slice(0, j), temp[j - WIDTH], ...temp.slice(j + 1)];
          } else {
            temp = [...temp.slice(0, j), 'NONE', ...temp.slice(j + 1)];
          }
        }
      }
    }
    setBoard(temp);

    // Fill empty spaces
    for (let i = 0; i < temp.length; i++) {
      if (temp[i] === 'NONE' || temp[i] === undefined) {
        temp = [...temp.slice(0, i), PIECES[Math.random() * PIECES.length | 0], ...temp.slice(i + 1)];
      }
    }
    setBoard(temp);
  }, [board, WIDTH, started])

  return (
    <div id='gameboard'>
      {display}
    </div>
  )
}

export default Gameboard;
