var board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var huPlayer = "X";
var aiPlayer = "O";
var iter = 0;
var round = 0;
var boxes = document.querySelectorAll(".box");
var type = document.querySelector("#type");
var turnX = document.querySelector(".turnX");
var turnO = document.querySelector(".turnO");
var turn = 0;
var resBtn = document.querySelector("#res");
var scoreHu = 0;
var scoreAi = 0;
var scoreLeftText = document.querySelector(".scoreLeft");
var scoreRightText = document.querySelector(".scoreRight");

resBtn.addEventListener("click", () => {
  console.log(1111);
  reset();
});

type.addEventListener("change", function() {
  firstPlayerColor();
  scoreAi = 0;
  scoreHu = 0;
  reset();
});
function firstPlayerColor() {
  if (type.value == "O") {
    turnO.classList.add("myO");
    turnX.classList.remove("myX");
  } else if (type.value == "X") {
    turnX.classList.add("myX");
    turnO.classList.remove("myO");
  }
}
boxes.forEach(item => {
  item.addEventListener("click", () => {
    move(item, huPlayer);
  });
});

function addBackground(board) {
  for (let i = 0; i < board.length; i++) {
    if (board[i] == "X") {
      boxes[i].classList.add("myX");
    } else if (board[i] == "O") {
      boxes[i].classList.add("myO");
    }
  }
}

function currentPlayer() {
  turnO.classList.toggle("myO");
  turnX.classList.toggle("myX");
}

function move(element, player) {
  if (
    board[element.getAttribute("data-ceil")] != "X" &&
    board[element.getAttribute("data-ceil")] != "O"
  ) {
    if (type.value != "ai") {
      if (type.value == "O") {
        player = "X";
        aiPlayer = "O";
        turn++;
      } else {
        player = "O";
        aiPlayer = "X";
      }
      if (round % 2) {
        element.textContent = player;
        board[element.getAttribute("data-ceil")] = player;
      } else {
        element.textContent = aiPlayer;
        board[element.getAttribute("data-ceil")] = aiPlayer;
      }
      currentPlayer();
    } else {
      element.textContent = player;
      board[element.getAttribute("data-ceil")] = player;
    }
    addBackground(board);
    round++;
    if (winning(board, player)) {
      setTimeout(function() {
        alert(`${huPlayer} WIN`);
        scoreHu++;
        reset();
      }, 500);
      return;
    } else if (winning(board, aiPlayer)) {
      setTimeout(function() {
        alert(`${aiPlayer} WIN`);
        scoreAi++;
        reset();
      }, 500);
      return;
    } else if (round > 8) {
      setTimeout(function() {
        alert("TIE");
        reset();
      }, 500);
      return;
    } else if (type.value == "ai") {
      setTimeout(function() {
        round++;
        var index = minimax(board, aiPlayer).index;
        console.log(index);
        board[index] = aiPlayer;
        boxes[index].textContent = aiPlayer;
        if (winning(board, aiPlayer)) {
          addBackground(board);
          setTimeout(function() {
            alert("YOU LOSE");
            reset();
          }, 500);
          return;
        } else if (round === 0) {
          setTimeout(function() {
            alert("tie");
            reset();
          }, 500);
          return;
        }
        console.log(board);
        addBackground(board);
        console.log(scoreAi, scoreAi);
      }, 250);
    }
  }
}

function winning(board, player) {
  if (
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)
  ) {
    return true;
  } else {
    return false;
  }
}

function minimax(reboard, player) {
  iter++;
  let array = avail(reboard);
  if (winning(reboard, huPlayer)) {
    return {
      score: -10
    };
  } else if (winning(reboard, aiPlayer)) {
    return {
      score: 10
    };
  } else if (array.length === 0) {
    return {
      score: 0
    };
  }

  var moves = [];
  for (var i = 0; i < array.length; i++) {
    var move = {};
    move.index = reboard[array[i]];
    reboard[array[i]] = player;

    if (player == aiPlayer) {
      var g = minimax(reboard, huPlayer);
      move.score = g.score;
    } else {
      var g = minimax(reboard, aiPlayer);
      move.score = g.score;
    }
    reboard[array[i]] = move.index;
    moves.push(move);
  }

  var bestMove;
  if (player == aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function avail(reboard) {
  return reboard.filter(s => s != "X" && s != "O");
}

function reset() {
  round = 0;
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  boxes.forEach(item => {
    item.textContent = "";
    item.classList.remove("myX");
    item.classList.remove("myO");
  });
  firstPlayerColor();

  scoreLeftText.textContent = `score: ${scoreAi}`;
  scoreRightText.textContent = `score ${scoreHu}`;
}
