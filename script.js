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
        checkForWin();
        Game.changeTurns();
    };

    // Check for win condition (or tie)
    const checkForWin = function() {

    }

    return { isTaken, markMove, render };
}) ();

// Player factory
    // Is bot?

const Player = (name, marker) => {
    return { name, marker };
}

const player1 = Player("Player 1", "X");

const player2 = Player("Player 2", "O");

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

        return { currentPlayer, state, changeTurns };
        
}) ();
    