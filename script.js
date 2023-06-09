// Gameboard module
const gameboard = (function() {
    // Gameboard array
    const board = [
        document.querySelector("#grid-1"),
        document.querySelector("#grid-2"),
        document.querySelector("#grid-3"),
        document.querySelector("#grid-4"),
        document.querySelector("#grid-5"),
        document.querySelector("#grid-6"),
        document.querySelector("#grid-7"),
        document.querySelector("#grid-8"),
        document.querySelector("#grid-9")
    ];

    // Add EventListeners for clicking the grids
    board.forEach((grid, index) => {
        grid.addEventListener("click", () => {
            if(Game.currentPlayer.isBot) { return; } // Prevent player from making a move during bot turn
            markMove(index);
        });
    });

    //Render game pieces on the board
    const render = function() {
        board.forEach((grid, index) => {
            grid.innerHTML = Game.state[index];
        });
    };

    const highlightSquares = function(one, two, three) {
        board[one].classList.add("winner");
        board[two].classList.add("winner");
        board[three].classList.add("winner");
    };

    const removeHighlighting = function() {
        board.forEach((grid) => {
            grid.classList.remove("winner");
        });
    };


    // Check if position is taken
    const isTaken = function(position) {
        if(Game.state[position]) {
            return true;
        } else return false;
    }

    // Mark position method
    const markMove = function(position) {

        if (!Game.isActive) { return; } // do nothing if there is not currently a game being played

        if(isTaken(position)) {
            return;
        }

        Game.state[position] = Game.currentPlayer.marker;
        gameboard.render();
        Game.checkForWin(Game.state);
        Game.changeTurns();
    };

    return { isTaken, markMove, render, highlightSquares, removeHighlighting };
}) ();

// Player factory
    // Is bot?

const Player = (name, display, marker, winCount, isBot, hardmode, initialized) => {
    return { name, display, marker, winCount, isBot, hardmode, initialized };
}

let player1 = Player("Player 1", document.querySelector("#player1-info"), "", 0, false, false, false);
let player2 = Player("Player 2", document.querySelector("#player2-info"), "", 0, false, false, false);

const Players = (function() {

        // Event listeners for initializing players

        document.querySelector("#p1-initialize").addEventListener("click", ()=> {
            initializePlayer(1);
        });

        document.querySelector("#p2-initialize").addEventListener("click", ()=> {
            initializePlayer(2);
        });

        function initializePlayer(player) {
            
            const playername = prompt(`Enter a name for Player ${player}`);
            let playermarker = prompt(`Hello, ${playername}. What marker would you like to play with?`);
            while((playermarker.length !== 1) || (playermarker === (player === 1 ? player2.marker : player1.marker))) {
                playermarker = prompt("Please enter a single character that hasn't already been chosen.");
            }

            const newPlayer =  Player(playername, "", playermarker, 0, false, false, true);
    
            if (player === 1) {
                newPlayer.display = document.querySelector("#player1-info");
                player1 = newPlayer;
            } else {
                newPlayer.display = document.querySelector("#player2-info");
                player2 = newPlayer;
            }
    
            Scoreboard.update();
        }

}) ();


// Game flow module
    // Whose turn  is it?
const Game = (function() {
        let currentPlayer = player1;
        let isActive = false;
        let whoWentFirst = null;
    
        const changeTurns = function() {

            if(!Game.isActive) { return; }

            player1.display.classList.toggle("active");
            player2.display.classList.toggle("active");
            if(Game.currentPlayer === player1) {
                Game.currentPlayer = player2;
            } else Game.currentPlayer = player1;

            if (Game.currentPlayer.isBot) {
                setTimeout(Bot.makeMove, 500);
            }
        };

        const removeHighlightingFromPlayers = function() {
            player1.display.classList.remove("active");
            player1.display.classList.remove("winner");
            player2.display.classList.remove("active");
            player2.display.classList.remove("winner");
        };

        const state = [ "", "", "", "", "", "", "", "", "" ];

        // take a gamestate as the argument, and optional testing argument - if testing is true, will only return winner and not perform endgame functions
        const checkForWin = function(gamestate, testing) {
            if( ((gamestate[0] === gamestate [1]) && (gamestate[1] === gamestate[2]) && gamestate[0]) ) { // top row
                if(testing) { return gamestate[0]; }
                endGame(Game.currentPlayer);
                gameboard.highlightSquares(0, 1, 2);
             } else if ((gamestate[3] === gamestate [4]) && (gamestate[4] === gamestate[5]) && gamestate[3]) { // middle row
                if(testing) { return gamestate[3]; }
                endGame(Game.currentPlayer);
                gameboard.highlightSquares(3, 4, 5);
             } else if ((gamestate[6] === gamestate [7]) && (gamestate[7] === gamestate[8]) && gamestate[6]) { // bottom row
                if(testing) { return gamestate[6]; }
                endGame(Game.currentPlayer);
                gameboard.highlightSquares(6, 7, 8);
             } else if ((gamestate[0] === gamestate [3]) && (gamestate[3] === gamestate[6]) && gamestate[0]) { // left column
                if(testing) { return gamestate[0]; }
                endGame(Game.currentPlayer);
                gameboard.highlightSquares(0, 3, 6);
             } else if ((gamestate[1] === gamestate [4]) && (gamestate[4] === gamestate[7]) && gamestate[1]) { // middle column
                if(testing) { return gamestate[1]; }
                endGame(Game.currentPlayer);
                gameboard.highlightSquares(1, 4, 7);
             } else if ((gamestate[2] === gamestate [5]) && (gamestate[5] === gamestate[8]) && gamestate[2]) { // right column
                if(testing) { return gamestate[2]; }
                endGame(Game.currentPlayer);
                gameboard.highlightSquares(2, 5, 8);
             } else if ((gamestate[0] === gamestate [4]) && (gamestate[4] === gamestate[8]) && gamestate[0]) { // top left to bottom right diagonal
                if(testing) { return gamestate[0]; }
                endGame(Game.currentPlayer);
                gameboard.highlightSquares(0, 4, 8);
             } else if ((gamestate[2] === gamestate [4]) && (gamestate[4] === gamestate[6]) && gamestate[2]) { // top right to bottom left diagonal
                if(testing) { return gamestate[2]; }
                endGame(Game.currentPlayer);
                gameboard.highlightSquares(2, 4, 6);
             } else if (gamestate.every(Boolean)) { // returns true if every position on the board is taken already - ie, checks for tie
                if(testing) { return "tie"; }
                endGame();
            }
            return null;
        };

        const endGame = function(winner) { // will end game, award point to winner and display appropriate message. Tie if no argument is passed

            removeHighlightingFromPlayers();

            if(winner) {
                Display.update(`${winner.name} wins!`);
                winner.winCount++;
                winner.display.classList.add("winner");
                Scoreboard.update();
            } else {
                Display.update("It's a tie!");
            }
            Game.isActive = false;
        };

        // Event listener for new button game - resets current game, won't start a game if there are not 2 players initialized

        document.querySelector("#new-game-btn").addEventListener("click", () => {

            if(!player1.initialized || !player2.initialized) { return  };

            for(let i = 0; i < state.length; i++) { // clear the gamestate
                state[i] = "";
            }
            gameboard.render();
            removeHighlightingFromPlayers();
            gameboard.removeHighlighting();

           if(whoWentFirst != player1) {
                whoWentFirst = player1;
           } else whoWentFirst = player2;

           Game.currentPlayer = whoWentFirst;

            Game.currentPlayer.display.classList.toggle("active");
            Game.isActive = true;
            if(Game.currentPlayer.isBot) {
                Bot.makeMove();
            }
            Display.update("Game in progress.");
        });

        return { currentPlayer, state, isActive, changeTurns, checkForWin };
        
}) ();

const Scoreboard = (function() {

    const playerOneName = document.querySelector("#p1-name");
    const playerOneMarker = document.querySelector("#p1-marker-display");
    const playerOneWins = document.querySelector("#p1-wins");
    const playerTwoName = document.querySelector("#p2-name");
    const playerTwoMarker = document.querySelector("#p2-marker-display");
    const playerTwoWins = document.querySelector("#p2-wins");

    const update = function() {
        playerOneName.innerHTML = player1.name;
        playerOneMarker.innerHTML = player1.marker;
        playerOneWins.innerHTML = player1.winCount;
        playerTwoName.innerHTML = player2.name;
        playerTwoMarker.innerHTML = player2.marker;
        playerTwoWins.innerHTML = player2.winCount;
    };

    return { update };
}) (); 

const Display = (function() {
    const displayBox = document.querySelector("#display-box");

    const update = function(message) {
        displayBox.innerHTML = message;
    }

    return { update };
}) ();

const Bot = (function() {

    const botNames = [ "TTT 3000", "Skynet", "Bot Stuff", "Jarvis" ];
    const botMarkers = [ "X", "O", "🤖", "😎" ]

    // Event Listeners for adding Bots as players
    
    document.querySelector("#p1-bot-easy").addEventListener("click", ()=> {
        initializeBot(1, false);
    });

    document.querySelector("#p1-bot-hard").addEventListener("click", ()=> {
        initializeBot(1, true);
    });

    document.querySelector("#p2-bot-easy").addEventListener("click", ()=> {
        initializeBot(2, false);
    });

    document.querySelector("#p2-bot-hard").addEventListener("click", ()=> {
        initializeBot(2, true);
    });

    function initializeBot(player, hardmode) {
        let playername = botNames[Math.floor(Math.random() * 4)];
        while(playername === player1.name) {
            playername = botNames[Math.floor(Math.random() * 4)];
        }

        let playermarker = botMarkers[Math.floor(Math.random() * 4)];
        while(playermarker === player1.marker) {
            playermarker = botMarkers[Math.floor(Math.random() * 4)];
        }

        const newPlayer =  Player(playername, "", playermarker, 0, true, hardmode, true);

        if (player === 1) {
            newPlayer.display = document.querySelector("#player1-info");
            player1 = newPlayer;
        } else {
            newPlayer.display = document.querySelector("#player2-info");
            player2 = newPlayer;
        }

        Scoreboard.update();
    }


    const getAvailableMoves = function(gamestate) {
        const movesArray = [];

        gamestate.forEach((element, index) => {
            if(!element) {
                movesArray.push(index);
            }
        });
        return movesArray;
    }

    const makeMove = function() {
        const availableMoves = getAvailableMoves(Game.state);
        let position;

        if(Game.currentPlayer.hardmode) { // if hard bot, use minimax algorithm
            position = minimax(Game.state, Game.currentPlayer.marker, Game.currentPlayer.marker).move;
        } else { // if easy bot, choose random move
            position = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
        gameboard.markMove(position);
    }

    return { makeMove, getAvailableMoves };
}) ();

function minimax(gamestate, currentMarker, maxMarker) {

    const winner = Game.checkForWin(gamestate, true);
    const minMarker = (currentMarker === player1.marker) ? player2.marker : player1.marker;

    if(winner) {
        let score;
        if(winner === maxMarker) {
            score = 1;
        } else if (winner === "tie") {
            score = 0;
        } else score = -1;
        return { score: score, move: null };
    }

    const availableMoves = Bot.getAvailableMoves(gamestate);
    let bestScore;
    let bestMove;

    if(currentMarker === maxMarker) {
        bestScore = -Infinity;
    } else bestScore = Infinity;

    availableMoves.forEach(moveSpot => {
        const newGamestate = [...gamestate];
        newGamestate[moveSpot] = currentMarker;
        const result = minimax(newGamestate, minMarker, maxMarker);

        if(currentMarker === maxMarker) {
            if(result.score > bestScore) {
                bestScore = result.score;
                bestMove = moveSpot;
            }
        } else {
            if(result.score < bestScore) {
                bestScore = result.score;
                bestMove = moveSpot;
            }
        }
    });
    return { score: bestScore, move: bestMove };
}