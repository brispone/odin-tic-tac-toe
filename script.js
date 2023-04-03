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
        if(isTaken(position)) {
            alert("That position is taken");
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

const Player = (name, marker, winCount) => {
    return { name, marker, winCount };
}

const player1 = Player("Player 1", "X", 0);

const player2 = Player("Player 2", "O", 0);

// Game flow module
    // Whose turn  is it?
const Game = (function() {
        let currentPlayer = player1;
    
        const changeTurns = function() {
            if(Game.currentPlayer === player1) {
                Game.currentPlayer = player2;
            } else Game.currentPlayer = player1;
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
                endGame(currentPlayer);
            } else if (state.every(Boolean)) { // returns true if every position on the board is taken already - ie, checks for tie
                endGame();
            }
                
        };

        const endGame = function(winner) { // will end game, award point to winner and display appropriate message. Tie if no argument is passed
            if(winner) {
                console.log(`${winner.name} wins!`);
            } else {
                console.log("It's a tie!");
            }
        };

        return { currentPlayer, state, changeTurns, checkForWin };
        
}) ();
    