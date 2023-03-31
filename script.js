// Gameboard module
const Gameboard = (function() {
    // Gameboard array
    const gameboard = [
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

    // Check if position is taken
    const isTaken = function(position) {
        if(gameboard[position].innerHTML) {
            return true;
        } else return false;
    }

    // Mark position method
    const markMove = function(position, marker) {
        if(isTaken(position)) {
            console.log("That position is taken");
            return;
        }
        gameboard[position].innerHTML = marker;
    };
    
    // Check for win method

    return { markMove };
}) ();

// Game flow module
    // Whose turn  is it?


// Player factory
    // Player name
    // Xs or Os?
    // Is bot?