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
        grid.addEventListener("click", () => markMove(index));
    });

    //Render game pieces on the board
    const render = function() {
        board.forEach((grid, index) => {
            grid.innerHTML = Game.state[index];
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
        Game.checkForWin();
        Game.changeTurns();
    };

    return { isTaken, markMove, render };
}) ();

// Player factory
    // Is bot?

const Player = (name, display, marker, winCount, initialized) => {
    return { name, display, marker, winCount, initialized };
}

const player1 = Player("", document.querySelector("#player1-info"), "", 0, false);
const player2 = Player("", document.querySelector("#player2-info"), "", 0, false);

const Players = (function() {

        // Event listeners for initializing players

        document.querySelector("#p1-initialize").addEventListener("click", ()=> {
            const playername = prompt("Enter a name for Player 1");
            let playermarker = prompt(`Hello, ${playername}. What marker would you like to play with?`);
            while(playermarker.length !== 1) {
                playermarker = prompt("Please enter a single character for your marker");
            }
            player1.name = playername;
            player1.marker = playermarker;
            player1.initialized = true;
            Scoreboard.update();
        });

        document.querySelector("#p2-initialize").addEventListener("click", ()=> {
            const playername = prompt("Enter a name for Player 1");
            let playermarker = prompt(`Hello, ${playername}. What marker would you like to play with?`);
            while(playermarker.length !== 1) {
                playermarker = prompt("Please enter a single character for your marker");
            }
            player2.name = playername;
            player2.marker = playermarker;
            player2.initialized = true;
            Scoreboard.update();
        });    
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
        };

        const removeHighlightingFromPlayers = function() {
            player1.display.classList.remove("active");
            player1.display.classList.remove("winner");
            player2.display.classList.remove("active");
            player2.display.classList.remove("winner");
        };

        const state = [ "", "", "", "", "", "", "", "", "" ];

        const checkForWin = function() {
            if( ((state[0] === state [1]) && (state[1] === state[2]) && state[0]) || // top row
                ((state[3] === state [4]) && (state[4] === state[5]) && state[3]) || // middle row
                ((state[6] === state [7]) && (state[7] === state[8]) && state[6]) || // bottom row
                ((state[0] === state [3]) && (state[3] === state[6]) && state[0]) || // left column
                ((state[1] === state [4]) && (state[4] === state[7]) && state[1]) || // middle column
                ((state[2] === state [5]) && (state[5] === state[8]) && state[2]) || // right column
                ((state[0] === state [4]) && (state[4] === state[8]) && state[0]) || // top left to bottom right diagonal
                ((state[2] === state [4]) && (state[4] === state[6]) && state[2])    // top right to bottom left diagonal
            ) {
                endGame(Game.currentPlayer);
            } else if (state.every(Boolean)) { // returns true if every position on the board is taken already - ie, checks for tie
                endGame();
            }
                
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

           if(whoWentFirst != player1) {
                whoWentFirst = player1;
           } else whoWentFirst = player2;

           Game.currentPlayer = whoWentFirst;

            Game.currentPlayer.display.classList.toggle("active");
            Game.isActive = true;
            Display.update("Game in progress.");
        });

        return { currentPlayer, state, isActive, changeTurns, checkForWin };
        
}) ();

const Scoreboard = (function() {

    const playerOneName = document.querySelector("#p1-name");
    const playerOneMarker = document.querySelector("#p1-marker");
    const playerOneWins = document.querySelector("#p1-wins");
    const playerTwoName = document.querySelector("#p2-name");
    const playerTwoMarker = document.querySelector("#p2-marker");
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