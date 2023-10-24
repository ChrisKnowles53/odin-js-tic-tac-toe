// What is it? IIFE to keep the render message private and only accessible by displayController.renderMessage(message)
// Why use it?  It means we can access the use of renderMessage but not change it with other other parts of the code

const displayController = (() => {
  const renderMessage = (message) => {
    document.querySelector("#message").innerHTML = message;
  };
  return {
    renderMessage,
  };
})();

// What is it? An IIFE module that contains functions relavent to the gameboard.
// render - creates displays the board
// update - Updates the specific gameboard square with the current players mark
// getGameboard - Allows access to the gameboards data
// Why use it? It means we can access the use of render, update and getGameboard outside of the module but without directly exposing or modifying the functions outside of the module

const Gameboard = (() => {
  let createGameBoard = ["", "", "", "", "", "", "", "", ""];

  const render = () => {
    const gameboardParentDiv = document.querySelector("#gameboard");
    gameboardParentDiv.innerHTML = "";

    createGameBoard.forEach((square, index) => {
      const squareDiv = document.createElement("div");
      squareDiv.classList.add("square");
      squareDiv.id = `square-${index}`;
      squareDiv.textContent = square;

      squareDiv.addEventListener("click", Game.handleClick);
      gameboardParentDiv.appendChild(squareDiv);
    });
  };

  const update = (index, mark) => {
    createGameBoard[index] = mark;
    render();
  };

  const getGameboard = () => createGameBoard;

  return {
    render,
    update,
    getGameboard,
  };
})();

// Factory to create players
const createPlayer = (name, mark) => {
  return {
    name,
    mark,
  };
};

// What is it? an IIFE Module that contains the functions relevant to running the game
// start - defines actions for game start
// handleClick - Every time there is a click it checks for: 1) win = display win message  2) no win = player makes next move 3)if tie = display tie message
// playAgain - defines acitions for playing game again without inputing new player names
// newGame - reloads the window to restart again with player name input
// Why use it? It means we can access the use of start, handleClick, playAgain and newGame outside of the module but without directly exposing or modifying the functions outside of the module
const Game = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;

  const start = () => {
    players = [
      createPlayer(document.querySelector("#player1").value, "X"),
      createPlayer(document.querySelector("#player2").value, "O"),
    ];
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.render();
  };

  const handleClick = (event) => {
    if (gameOver) {
      return;
    }
    let index = parseInt(event.target.id.split("-")[1]);
    if (Gameboard.getGameboard()[index] !== "") return;

    Gameboard.update(index, players[currentPlayerIndex].mark);

    if (
      checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)
    ) {
      gameOver = true;
      displayController.renderMessage(
        `🎉🎉  ${players[currentPlayerIndex].name} wins 🎉🎉`
      );
    } else if (checkForTie(Gameboard.getGameboard())) {
      gameOver = true;
      displayController.renderMessage("👔 Its a tie 👔");
    }
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  };

  const playAgain = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, "");
    }
    Gameboard.render();

    gameOver = false;
    document.querySelector("#message").innerHTML = "";
  };

  const newGame = () => {
    window.location.reload();
  };

  return {
    start,
    playAgain,
    newGame,
    handleClick,
  };
})();

// Function to check for win by looping through each row of the array and checking if the current marker is in the relevant cells
function checkForWin(board) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    // deconstructs the line [a,b,c] into indiviual variables ready for comparison
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      // if the board[a] is empty return false if board[a] has a value (X or O) then continue to check if position 'b' has a value that matches 'a' if true then check position 'c' if false return false.
      return true;
    }
  }
  return false;
}

// Function for tie - Checks if all the cells have content
function checkForTie(board) {
  return board.every((cell) => cell !== "");
}

// Eventlisteners for the three buttons
const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
  Game.playAgain();
});

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
  Game.start();
});

const newGame = document.querySelector("#new-game-button");
newGame.addEventListener("click", () => {
  Game.newGame();
});
