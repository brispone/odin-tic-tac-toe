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

    // Check if position is taken
    const isTaken = function(position) {
        if(board[position].innerHTML) {
            return true;
        } else return false;
    }

    // Mark position method
    const markMove = function(position) {
        if(isTaken(position)) {
            console.log("That position is taken");
            return;
        }
        board[position].innerHTML = Game.currentPlayer.marker;
    };

    // Check for win method

    return { isTaken, markMove };
}) ();

// Game flow module
    // Whose turn  is it?
const Game = {
    currentPlayer: {
        marker: "X"
    }
    
};

// Player factory
    // Player name
    // Xs or Os?
    // Is bot?