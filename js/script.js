let container = document.querySelector('.container');
let takenWhite = document.querySelector('.takenWhite');
let takenBlack = document.querySelector('.takenBlack');

let board = [];
let copyBoard = [];
let from, to;
let fromIndex, toIndex;
let turn = 'white';

// let mated = {
//   color: null,
//   mateMove: null,
// };

let figures = {
  white: {
    rook: {
      src: './img/whiteRook.png',
      color: 'white',
      name: 'rook',
    },
    knight: {
      src: './img/whiteKnight.png',
      color: 'white',
      name: 'knight',
    },
    bishop: {
      src: './img/whiteBishop.png',
      color: 'white',
      name: 'bishop',
    },
    queen: {
      src: './img/whiteQueen.png',
      color: 'white',
      name: 'queen',
    },
    king: {
      src: './img/whiteKing.png',
      color: 'white',
      name: 'king',
    },
    pawn: {
      src: './img/whitePawn.png',
      color: 'white',
      name: 'pawn',
    },
  },
  black: {
    rook: {
      src: './img/blackRook.png',
      color: 'black',
      name: 'rook',
    },
    knight: {
      src: './img/blackKnight.png',
      color: 'black',
      name: 'knight',
    },
    bishop: {
      src: './img/blackBishop.png',
      color: 'black',
      name: 'bishop',
    },
    queen: {
      src: './img/blackQueen.png',
      color: 'black',
      name: 'queen',
    },
    king: {
      src: './img/blackKing.png',
      color: 'black',
      name: 'king',
    },
    pawn: {
      src: './img/blackPawn.png',
      color: 'black',
      name: 'pawn',
    },
  },
};
for (let i = 0; i < 8; i++) {
  let row = document.createElement('div');
  row.classList.add('row');

  let rowArr = [];
  let copyRowArr = [];

  for (let j = 0; j < 8; j++) {
    let col = document.createElement('div');
    col.classList.add('col');
    col.classList.add((i + j) % 2 === 0 ? 'white' : 'black');

    let figure = createFigure(i, j);
    if (figure) {
      col.appendChild(figure.img);
    }

    col.onclick = () => handleClick(i, j);

    rowArr.push({ col, figure });

    row.appendChild(col);
    copyRowArr.push(
      figure
        ? {
            color: figure.color,
            name: figure.name,
          }
        : null
    );
  }

  board.push(rowArr);
  copyBoard.push(copyRowArr);

  container.appendChild(row);
}

let h1 = document.createElement('h1');
h1.textContent = turn;
document.body.appendChild(h1);

// console.log(board);
// console.log(copyBoard);

function handleClick(i, j) {
  if (from && !board[i][j].col.classList.contains('possible')) {
    clear();
  }
  if (!from && board[i][j].figure && board[i][j].figure.color === turn) {
    fromIndex = { i, j };
    from = board[i][j];
    checkPossibleMoves(i, j);
  } else if (from) {
    to = board[i][j];
    toIndex = { i, j };
    move();
  }
}

function move() {
  if (from === to) {
    clear();
    return;
  }

  let imgSrc = from.figure.img.src;
  let name = from.figure.name;
  let color = from.figure.color;
  from.figure.img.remove();
  from.figure = null;
  copyBoard[fromIndex.i][fromIndex.j] = null;
  if (to.figure) {
    let toImgSrc = to.figure.img.src;
    let toFigureColor = to.figure.color;
    to.figure.img.remove();
    to.figure = null;

    let img = document.createElement('img');
    img.src = toImgSrc;
    if (toFigureColor === 'white') {
      takenBlack.appendChild(img);
    } else {
      takenWhite.appendChild(img);
    }
  }
  let img = document.createElement('img');
  img.src = imgSrc;
  to.figure = {
    img,
    name,
    color,
  };
  copyBoard[toIndex.i][toIndex.j] = {
    name,
    color,
  };
  to.col.appendChild(img);
  clear();
  turn = turn === 'white' ? 'black' : 'white';
  // if (mated.color) {
  //   alert(mated.color + ' wins');
  // }
  h1.textContent = turn;
  // checkForCheck();
}
// from: {i: 5, j: 1}, to: {i: 5, j: 1}
function moveOnCopy(from, to) {
  let fromInfo = { ...copyBoard[from.i][from.j] };
  let toInfo = copyBoard[to.i][to.j] ? { ...copyBoard[to.i][to.j] } : null;
  copyBoard[from.i][from.j] = null;
  copyBoard[to.i][to.j] = fromInfo;
  return () => {
    copyBoard[to.i][to.j] = toInfo;
    copyBoard[from.i][from.j] = fromInfo;
  };
}

function clear() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      board[i][j].col.classList.remove('possible');
      board[i][j].col.classList.remove('canTake');
    }
  }
  from = null;
  to = null;
}

function createFigure(i, j) {
  let img = document.createElement('img');
  let color = i < 2 ? 'black' : i > 5 ? 'white' : null;
  let name;
  switch (i) {
    case 0:
    case 7:
      switch (j) {
        case 0:
        case 7:
          img.src = figures[color].rook.src;
          name = figures[color].rook.name;
          break;
        case 1:
        case 6:
          img.src = figures[color].knight.src;
          name = figures[color].knight.name;
          break;
        case 2:
        case 5:
          img.src = figures[color].bishop.src;
          name = figures[color].bishop.name;
          break;
        case 3:
          img.src = figures[color].queen.src;
          name = figures[color].queen.name;
          break;
        case 4:
          img.src = figures[color].king.src;
          name = figures[color].king.name;
          break;
      }
      break;
    case 1:
    case 6:
      img.src = figures[color].pawn.src;
      name = figures[color].pawn.name;
      break;
  }
  return img.src ? { img, name, color } : null;
}
function hiddenCheck(i, j, hidden = false) {
  if (copyBoard[i][j]) {
    switch (copyBoard[i][j].name) {
      case 'rook':
        return checkRook(i, j, hidden);
      case 'bishop':
        return checkBishop(i, j, hidden);
      case 'queen':
        return checkQueen(i, j, hidden);
      case 'knight':
        return checkKnight(i, j, hidden);
      case 'king':
        return checkKing(i, j, hidden);
      case 'pawn':
        return checkPawn(i, j, hidden);
    }
  }
}

function checkPossibleMoves(i, j, hidden = false) {
  if (copyBoard[i][j]) {
    let moves;
    switch (copyBoard[i][j].name) {
      case 'rook':
        moves = checkRook(i, j, hidden);
        break;
      case 'bishop':
        moves = checkBishop(i, j, hidden);
        break;
      case 'queen':
        moves = checkQueen(i, j, hidden);
        break;
      case 'knight':
        moves = checkKnight(i, j, hidden);
        break;
      case 'king':
        moves = checkKing(i, j, hidden);
        break;
      case 'pawn':
        moves = checkPawn(i, j, hidden);
        break;
    }
    return finalCheckPossible(i, j, moves);
  }
}

// function isMated() {}

function finalCheckPossible(i, j, moves) {
  let color = copyBoard[i][j].color;
  let result = [];
  let pawnMoves;

  if (copyBoard[i][j].name === 'pawn') {
    pawnMoves = [...moves.possibleMoves, ...moves.possibleTakes];
    for (let k = 0; k < pawnMoves.length; k++) {
      let fallback = moveOnCopy({ i, j }, { i: pawnMoves[k][0], j: pawnMoves[k][1] });
      let checks = checkForCheck();
      // if (
      //   (checks.whiteKingIsChecked && checks.whiteKingIsMated) ||
      //   (checks.blackKingIsChecked && checks.blackKingIsMated)
      // ) {
      //   mated.color = color;
      //   mated.mateMove = { i: pawnMoves[k][0], j: pawnMoves[k][1] };
      // }
      if ((color === 'white' && !checks.whiteKingIsChecked) || (color === 'black' && !checks.blackKingIsChecked)) {
        result.push(pawnMoves[k]);
      }
      fallback();
    }
  } else {
    for (let k = 0; k < moves.length; k++) {
      //moves[k]   [1,5]
      let fallback = moveOnCopy({ i, j }, { i: moves[k][0], j: moves[k][1] });
      let checks = checkForCheck();
      // if (
      //   (checks.whiteKingIsChecked && checks.whiteKingIsMated) ||
      //   (checks.blackKingIsChecked && checks.blackKingIsMated)
      // ) {
      //   mated.color = color;
      //   mated.mateMove = { i: moves[k][0], j: moves[k][1] };
      // }
      if ((color === 'white' && !checks.whiteKingIsChecked) || (color === 'black' && !checks.blackKingIsChecked)) {
        result.push(moves[k]);
      }
      fallback();
    }
  }

  // result : [[2,1], [2, 5]] -> ["21", "25"]
  for (let k = 0; k < result.length; k++) {
    let target = board[result[k][0]][result[k][1]];
    if (copyBoard[i][j].name === 'pawn') {
      if (copyBoard[result[k][0]][result[k][1]] && copyBoard[result[k][0]][result[k][1]].color !== color) {
        target.col.classList.add('possible');
        target.col.classList.add('canTake');
      } else if (!copyBoard[result[k][0]][result[k][1]]) {
        if (j === result[k][1]) {
          target.col.classList.add('possible');
        }
      }
    } else {
      target.col.classList.add('possible');
      if (target.figure && target.figure.color !== color) {
        target.col.classList.add('canTake');
      }
    }
  }
  return result;
}

function checkForCheck() {
  let res = {
    whiteKingIsChecked: false,
    blackKingIsChecked: false,
    whiteKingIsMated: false,
    blackKingIsMated: false,
    isStalemate: false,
  };

  let kings = {
    white: {},
    black: {},
  };

  let whites = [];
  let blacks = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (copyBoard[i][j]) {
        if (copyBoard[i][j].name === 'king') {
          kings[copyBoard[i][j].color].i = i;
          kings[copyBoard[i][j].color].j = j;
        }
        let moves = hiddenCheck(i, j, true);
        copyBoard[i][j].color === 'white'
          ? whites.push(...(copyBoard[i][j].name === 'pawn' ? moves.possibleTakes : moves))
          : blacks.push(...(copyBoard[i][j].name === 'pawn' ? moves.possibleTakes : moves));
      }
    }
  }
  for (let i = 0; i < whites.length; i++) {
    if (whites[i][0] === kings.black.i && whites[i][1] === kings.black.j) {
      res.blackKingIsChecked = true;
    }
  }
  for (let i = 0; i < blacks.length; i++) {
    if (blacks[i][0] === kings.white.i && blacks[i][1] === kings.white.j) {
      res.whiteKingIsChecked = true;
    }
  }
  // if (res.whiteKingIsChecked && whites.length === 0) {
  //   res.whiteKingIsMated = true;
  //   console.log('white is mated');
  // }
  // if (res.blackKingIsChecked && blacks.length === 0) {
  //   res.blackKingIsMated = true;
  //   console.log('black is mated');
  // }
  return res;
}

function checkRook(i, j, hidden = false, color = null, dir = null, moves = []) {
  if (i < 0 || i > 7 || j < 0 || j > 7 || (dir && copyBoard[i][j])) {
    if (dir && copyBoard[i] && copyBoard[i][j] && copyBoard[i][j].color !== color) {
      moves.push([i, j]);
    }
    return;
  }
  if (dir) {
    moves.push([i, j]);
  }
  switch (dir) {
    case 'up':
      checkRook(i - 1, j, hidden, color, 'up', moves);
      break;
    case 'down':
      checkRook(i + 1, j, hidden, color, 'down', moves);
      break;
    case 'left':
      checkRook(i, j - 1, hidden, color, 'left', moves);
      break;
    case 'right':
      checkRook(i, j + 1, hidden, color, 'right', moves);
      break;
    default:
      let figureColor = copyBoard[i][j].color;
      checkRook(i - 1, j, hidden, figureColor, 'up', moves);
      checkRook(i + 1, j, hidden, figureColor, 'down', moves);
      checkRook(i, j - 1, hidden, figureColor, 'left', moves);
      checkRook(i, j + 1, hidden, figureColor, 'right', moves);
      break;
  }
  return moves;
  // i-1, j
  // i+1, j
  // i, j-1
  // i, j+1
}

function checkBishop(i, j, hidden = false, color = null, dir = null, moves = []) {
  if (i < 0 || i > 7 || j < 0 || j > 7 || (dir && copyBoard[i][j])) {
    if (dir && copyBoard[i] && copyBoard[i][j] && copyBoard[i][j] && copyBoard[i][j].color !== color) {
      moves.push([i, j]);
    }
    return moves;
  }
  if (dir) {
    moves.push([i, j]);
  }
  switch (dir) {
    case 'up':
      checkBishop(i - 1, j - 1, hidden, color, 'up', moves);
      break;
    case 'down':
      checkBishop(i - 1, j + 1, hidden, color, 'down', moves);
      break;
    case 'left':
      checkBishop(i + 1, j - 1, hidden, color, 'left', moves);
      break;
    case 'right':
      checkBishop(i + 1, j + 1, hidden, color, 'right', moves);
      break;
    default:
      let figureColor = copyBoard[i][j].color;
      checkBishop(i - 1, j - 1, hidden, figureColor, 'up', moves);
      checkBishop(i - 1, j + 1, hidden, figureColor, 'down', moves);
      checkBishop(i + 1, j - 1, hidden, figureColor, 'left', moves);
      checkBishop(i + 1, j + 1, hidden, figureColor, 'right', moves);
      break;
  }
  return moves;
  //i-1, j-1
  //i-1, j+1
  //i+1, j-1
  //i+1, j+1
}

function checkQueen(i, j, hidden) {
  return [...checkRook(i, j, hidden), ...checkBishop(i, j, hidden)];
}

function checkKnight(i, j, hidden) {
  let moves = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];
  let possibleMoves = [];

  for (let k = 0; k < moves.length; k++) {
    let newI = i + moves[k][0];
    let newJ = j + moves[k][1];
    if (newI >= 0 && newI < 8 && newJ >= 0 && newJ < 8) {
      let target = copyBoard[newI][newJ];
      if (!target || (target && target.color !== copyBoard[i][j].color)) {
        possibleMoves.push([newI, newJ]);
      }
    }
  }
  return possibleMoves;
}

function checkKing(i, j, hidden) {
  let moves = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  let possibleMoves = [];

  for (let k = 0; k < moves.length; k++) {
    let newI = i + moves[k][0];
    let newJ = j + moves[k][1];
    if (newI >= 0 && newI < 8 && newJ >= 0 && newJ < 8) {
      let target = copyBoard[newI][newJ];
      if (!target || (target && target.color !== copyBoard[i][j].color)) {
        possibleMoves.push([newI, newJ]);
      }
    }
  }
  return possibleMoves;
}

function checkPawn(i, j, hidden) {
  let dir = copyBoard[i][j].color === 'white' ? -1 : 1;
  let possibleMoves = [];
  let possibleTakes = [];
  let newI = i + dir;
  if (newI >= 0 && newI < 8 && !copyBoard[newI][j]) {
    possibleMoves.push([newI, j]);
    if ((i === 6 && dir === -1) || (i === 1 && dir === 1)) {
      let secondNewI = newI + dir;
      if (secondNewI >= 0 && secondNewI < 8 && !copyBoard[secondNewI][j]) {
        possibleMoves.push([secondNewI, j]);
      }
    }
  }
  let leftJ = j - 1;
  if (leftJ >= 0 && leftJ < 8) {
    possibleTakes.push([newI, leftJ]);
  }

  let rightJ = j + 1;
  if (rightJ >= 0 && rightJ < 8) {
    possibleTakes.push([newI, rightJ]);
  }
  return {
    possibleMoves,
    possibleTakes,
  };
}

//handleClick
//  checkPossibleMoves() -> check figure -> final check -> check for check -> final check nkaruma
