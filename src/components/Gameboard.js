import { useEffect, useState } from "react";
import './Gameboard.css';
import Blue from '../images/GemBlue.svg';
import Green from '../images/GemGreen.svg';
import Orange from '../images/GemOrange.svg';
import Purple from '../images/GemPurple.svg';
import Red from '../images/GemRed.svg';
import White from '../images/GemWhite.svg';
import Yellow from '../images/GemYellow.svg';

const Gameboard = props => {
  const PIECES = ['WHITE', 'RED', 'BLUE', 'GREEN', 'PURPLE', 'ORANGE', 'YELLOW'];
  const WIDTH = props.width || 8;
  const DELAY = 260;
  const [board, setBoard] = useState([]);
  const [display, setDisplay] = useState(null);
  const [select, setSelect] = useState(null);

  const [started, setStarted] = useState(false);

  const [pop, setPop] = useState(false);
  const [drop, setDrop] = useState(false);
  const [repopulate, setRepopulate] = useState(false);

  const [dropMap, setDropMap] = useState(new Map());
  const [popSinceClick, setPopSinceClick] = useState(0);

  const [dragging, setDragging] = useState(false);
  const [touchX, setTouchX] = useState(null);
  const [touchY, setTouchY] = useState(null);

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
      let style = null;
      if (dropMap.has(index)) {
        const gem = document.getElementById(index);
        const num = -(Math.max(gem.offsetHeight, gem.offsetWidth) / 0.8) * dropMap.get(index);
        style = { transition: 'none', transform: `translateY(${num}px)` };
      }
      let image = null;
      switch (piece) {
        case 'BLUE':
          image = Blue;
          break;
        case 'GREEN':
          image = Green;
          break;
        case 'ORANGE':
          image = Orange;
          break;
        case 'PURPLE':
          image = Purple;
          break;
        case 'RED':
          image = Red;
          break;
        case 'WHITE':
          image = White;
          break;
        case 'YELLOW':
          image = Yellow;
          break;
        default:
          break;
      }
      return <img
        src={image}
        key={index}
        id={index}
        className={`board-piece ${piece} selected-${select === index}`}
        onClick={e => handleClick(e)}
        style={style}
        draggable={false}
        onMouseDown={e => handleMouseDown(e)}
        onMouseOver={e => handleMouseOver(e)}
        onTouchStart={e => handleTouchStart(e)}
        onTouchMove={e => handleTouchMove(e)}
      ></img>;
    }));

    const handleClick = e => {
      if (pop || drop || repopulate) return;
      setPopSinceClick(0);
      handleClickSwap(parseInt(e.target.id));
    };

    const handleMouseDown = e => {
      if (pop || drop || repopulate) return;
      setPopSinceClick(0);
      handleMouseDownSet(parseInt(e.target.id));
    };

    const handleMouseOver = e => {
      if (pop || drop || repopulate || !dragging || !select || select === parseInt(e.target.id)) return;
      setPopSinceClick(0);
      handleMouseOverSwap(parseInt(e.target.id));
    };

    const handleTouchStart = e => {
      if (pop || drop || repopulate) return;
      setPopSinceClick(0);
      handleTouchStartSet(e);
    };

    const handleTouchMove = e => {
      if (pop || drop || repopulate || !select) return;
      setPopSinceClick(0);
      const x = e.changedTouches[0].clientX;
      const y = e.changedTouches[0].clientY;
      const dx = x - touchX;
      const dy = y - touchY;
      if (dx === 0 && dy === 0) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        handleHorizontalSwap(dx > 0);
        return;
      }
      if (Math.abs(dx) < Math.abs(dy)) {
        handleVerticalSwap(dy > 0);
        return;
      }
    };
  }, [board, select, dropMap, pop, drop, repopulate, dragging, touchX, touchY]);

  const checkLegalSwap = move => {
    return (
      (move >= 0 && move < WIDTH * WIDTH) &&
      (
        (move === select - 1 && (move % WIDTH) !== WIDTH - 1) ||
        (move === select + 1 && (move % WIDTH) !== 0) ||
        move === select + WIDTH ||
        move === select - WIDTH
      )
    );
  };

  const handleMouseDownSet = clicked => {
    if (!select || !checkLegalSwap(clicked)) {
      setSelect(clicked);
      setDragging(true);
      return;
    }
  };

  const handleTouchStartSet = e => {
    const clicked = parseInt(e.target.id);
    if (!select || !checkLegalSwap(clicked)) {
      setTouchX(e.changedTouches[0].clientX);
      setTouchY(e.changedTouches[0].clientY);
      setSelect(clicked);
      setDragging(true);
      return;
    }
  }

  const handleClickSwap = clicked => {
    if (dragging) {
      setDragging(false);
      return;
    }
    if (!select) {
      setSelect(clicked);
      return;
    }
    if (clicked === select) {
      setSelect(null);
      return;
    }
    handleSwap(clicked, select);
  };

  const handleMouseOverSwap = mouseOver => {
    if (!dragging || !select || mouseOver === select || !checkLegalSwap(mouseOver)) return;
    handleSwap(mouseOver, select);
  };

  const handleHorizontalSwap = swapRight => {
    if (swapRight && checkLegalSwap(select + 1)) {
      handleSwap(select + 1, select);
      return;
    }
    if (!swapRight && checkLegalSwap(select - 1)) {
      handleSwap(select - 1, select);
      return;
    }
  };

  const handleVerticalSwap = swapDown => {
    if (swapDown && checkLegalSwap(select + WIDTH)) {
      handleSwap(select + WIDTH, select);
      return;
    }
    if (!swapDown && checkLegalSwap(select - WIDTH)) {
      handleSwap(select - WIDTH, select);
      return;
    }
  };

  const handleSwap = (clicked, selected) => {
    const gem1 = document.getElementById(clicked);
    const gem2 = document.getElementById(selected);
    gem2.classList.replace('selected-true', 'selected-false');
    gem1.style = null;
    gem2.style = null;
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
      gem1.style.transform = `translateX(${Math.max(gem1.offsetHeight, gem1.offsetWidth) / 0.8}px)`;
      gem2.style.transform = `translateX(-${Math.max(gem1.offsetHeight, gem1.offsetWidth) / 0.8}px)`;
      if (scores) {
        setTimeout(() => {
          let temp = [
            ...board.slice(0, selected - 1),
            board[selected], board[selected - 1],
            ...board.slice(selected + 1)
          ];
          setBoard(temp);
          gem1.style = null;
          gem2.style = null;
          gem1.style.transition = 'none';
          gem2.style.transition = 'none';
          setTimeout(() => setPop(true), DELAY);
        }, DELAY);
      } else {
        setTimeout(() => {
          gem1.style.transform = `translateX(0px)`;
          gem2.style.transform = `translateX(0px)`;
          gem1.style = null;
          gem2.style = null;
        }, DELAY);
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
      gem1.style.transform = `translateX(-${Math.max(gem1.offsetHeight, gem1.offsetWidth) / 0.8}px)`;
      gem2.style.transform = `translateX(${Math.max(gem1.offsetHeight, gem1.offsetWidth) / 0.8}px)`;
      if (scores) {
        setTimeout(() => {
          let temp = [
            ...board.slice(0, selected),
            board[selected + 1], board[selected],
            ...board.slice(selected + 2)
          ];
          setBoard(temp);
          gem1.style = null;
          gem2.style = null;
          gem1.style.transition = 'none';
          gem2.style.transition = 'none';
          setTimeout(() => setPop(true), DELAY);
        }, DELAY);
      } else {
        setTimeout(() => {
          gem1.style.transform = `translateX(0px)`;
          gem2.style.transform = `translateX(0px)`;
          gem1.style = null;
          gem2.style = null;
        }, DELAY);
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
      gem1.style.transform = `translateY(-${Math.max(gem1.offsetHeight, gem1.offsetWidth) / 0.8}px)`;
      gem2.style.transform = `translateY(${Math.max(gem1.offsetHeight, gem1.offsetWidth) / 0.8}px)`;
      if (scores) {
        setTimeout(() => {
          let temp = [
            ...board.slice(0, selected),
            board[selected + WIDTH],
            ...board.slice(selected + 1, selected + WIDTH),
            board[selected],
            ...board.slice(selected + WIDTH + 1)
          ];
          setBoard(temp);
          gem1.style = null;
          gem2.style = null;
          gem1.style.transition = 'none';
          gem2.style.transition = 'none';
          setTimeout(() => setPop(true), DELAY);
        }, DELAY);
      } else {
        setTimeout(() => {
          gem1.style.transform = `translateY(0px)`;
          gem2.style.transform = `translateY(0px)`;
          gem1.style = null;
          gem2.style = null;
        }, DELAY);
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
      gem1.style.transform = `translateY(${Math.max(gem1.offsetHeight, gem1.offsetWidth) / 0.8}px)`;
      gem2.style.transform = `translateY(-${Math.max(gem1.offsetHeight, gem1.offsetWidth) / 0.8}px)`;
      if (scores) {
        setTimeout(() => {
          let temp = [
            ...board.slice(0, selected - WIDTH),
            board[selected],
            ...board.slice(selected - WIDTH + 1, selected),
            board[selected - WIDTH],
            ...board.slice(selected + 1)
          ];
          setBoard(temp);
          gem1.style = null;
          gem2.style = null;
          gem1.style.transition = 'none';
          gem2.style.transition = 'none';
          setTimeout(() => setPop(true), DELAY);
        }, DELAY);
      } else {
        setTimeout(() => {
          gem1.style.transform = `translateY(0px)`;
          gem2.style.transform = `translateY(0px)`;
          gem1.style = null;
          gem2.style = null;
        }, DELAY);
      }
      setSelect(null);
    } else {
      setSelect(clicked);
    }
  };

  // Check for groups to pop (lines >= 3) then remove those pieces from board
  useEffect(() => {
    if (!started) return;
    if (!pop) return;
    let lines = [];
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

    if (lines.length < 1) {
      setPop(false);
      return;
    }

    // Clear matches
    let temp = board;
    for (const line of lines) {
      const base = 10;
      const weight = (line.length - 2) * (line.length - 2);
      const cluster = lines.length;
      const multiplier = popSinceClick + 1;
      props.increaseScore(base * weight * cluster * multiplier);
      for (const space of line) {
        temp = [...temp.slice(0, space), 'NONE', ...temp.slice(space + 1)];
      }
    }
    setPopSinceClick(p => p + lines.length);
    setBoard(temp);
    // Delay needed to have breaking and dropping effect
    setTimeout(() => {
      setPop(false);
      setDrop(true)
    }, DELAY);
  }, [started, pop]);

  // Drop existing gems
  useEffect(() => {
    if (!started) return;
    if (!drop) return;
    let temp = board;
    // Drop pieces
    const seen = new Map();
    for (let i = 0; i < temp.length - WIDTH; i++) {
      if (temp[i + WIDTH] === 'NONE') {
        for (let j = i + WIDTH; j >= 0; j -= WIDTH) {
          seen.set(j, (seen.get(j - WIDTH) || 0) + 1);
          temp = [...temp.slice(0, j), temp[j - WIDTH] || 'NONE', ...temp.slice(j + 1)];

          if (j >= 0) {
            const gem = document.getElementById(j);
            setTimeout(() => {
              gem.style = null;
            }, DELAY);
          }
        }
      }
    }
    setBoard(temp);
    setDropMap(seen);
    setTimeout(() => setDropMap(new Map()), DELAY)
    setTimeout(() => {
      setDrop(false);
      setRepopulate(true)
    }, DELAY * 1.5);
  }, [started, drop]);

  // Drop replacement gems
  useEffect(() => {
    if (!started) return;
    if (!repopulate) return;
    let temp = board;
    // Fill empty spaces
    const list = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i] === 'NONE' || temp[i] === undefined) {
        temp = [...temp.slice(0, i), PIECES[Math.random() * PIECES.length | 0], ...temp.slice(i + 1)];
        list.push(i);
      }
    }
    setBoard(temp);
    for (const i of list) {
      document.getElementById(i).style.transition = 'none';
      document.getElementById(i).style.transform = 'translateY(-100vh)';
      setTimeout(() => {
        document.getElementById(i).style.transition = null;
        document.getElementById(i).style.transform = 'translateY(0px)';
        document.getElementById(i).style = null;
      }, DELAY);
    }
    setTimeout(() => {
      setRepopulate(false);
      setPop(true)
    }, DELAY * 2);
  }, [started, repopulate]);

  return (
    <div id='gameboard'>
      {display}
    </div>
  )
}

export default Gameboard;
