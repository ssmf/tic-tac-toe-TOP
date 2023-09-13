const boardGrid = document.getElementById('board-grid');
const signBlueprint = document.createElement('p');
const winnerDisplay = document.querySelector('h1');
const playButton = document.getElementById('play-again');

const l1 = document.querySelector('.l1');
const l2 = document.querySelector('.l2');
const l3 = document.querySelector('.l3');

const t1 = document.querySelector('.t1');
const t2 = document.querySelector('.t2');
const t3 = document.querySelector('.t3');

const checkCells = [[l1, l2, l3], [t3], [t1, t2, t3], [l1]];

const Player = function(name, sign) {
    return {name, sign};
}

const gameSystem = (function() {
    const player1 = Player('blossmd1', 'X');
    const player2 = Player('ssmf2', 'O');
    const boardGridChildren = Array.from(boardGrid.children);
    let currentChoice = player1;
    let roundStartPlayer = currentChoice;

    const roundStart = function() {
        boardRestart();
        winnerDisplay.textContent = 'new game has begun!';
        roundStartPlayer = (roundStartPlayer == player1) ? player2 : player1;
        currentChoice = roundStartPlayer;

    };

    const boardRestart = function() {
        boardGridChildren.forEach(element => {
            element.replaceChildren();
        });

    };

    const picked = function() {
        if (!this.firstChild) {
            if(placeSign(this) == true) {
                endGame(true);
            }
        };
    };

    const endGame = function(isThereAWinner) {
        boardGridChildren.forEach(e => {
            if (!e.firstChild) {e.appendChild(signBlueprint.cloneNode())};
        });
        if (isThereAWinner) {
            winnerDisplay.textContent = `${currentChoice.name} wins!`
        }
        else {
            winnerDisplay.textContent = `It's a tie!`;
        };
    };

    const placeSign = function(element) {
        let choice = signBlueprint.cloneNode();
        element.appendChild(choice);
        choice.textContent = currentChoice.sign;
        choice.classList.add('cell');
        if (ifWins() == true) {return true};
        currentChoice = (currentChoice == player1) ? player2 : player1;

    };

    const ifWins = function() {
        //Check if someone have won
        for (groupId in checkCells) {        
            for (cellId in checkCells[groupId]) {
                let row = checkCells[groupId][cellId];
                let wins = getCells(row, Number(groupId) + 1);
                if (wins == true) {return true};
            }
        }
        //Check if there is a tie
        if (ifTie() == true) {
            endGame(false);
        };
        return false;
    };

    const getCells = function(row, times) {
        let sign = currentChoice.sign;
        let currentId = boardGridChildren.indexOf(row);
        let currentCells = [];
        for (let i = 0; i < 3; i++) {
            currentCells.push(boardGridChildren[currentId + i * times].textContent);
        };
         return validateCells(currentCells, sign);
    };

    const validateCells = function(cells, sign) {
        let match = true;

        cells.forEach(cell => {
            if (cell != sign) {
                match = false;
            }
        })
        return match;
    };

    const ifTie = function() {
        let a = true;
        boardGridChildren.forEach(e => {
            if (e.firstChild === null) {a = false};
        });
        console.log(a);
        return a;
    };

    //button Binder
    (function() {
        boardGridChildren.forEach(element => {
            element.addEventListener('click', picked);
        });

        playButton.onclick = () => {roundStart()};

    })();

})();