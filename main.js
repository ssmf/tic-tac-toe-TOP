const boardGrid = document.getElementById('board-grid');
const signBlueprint = document.createElement('p');
const winnerDisplay = document.getElementById('winner-display');
const playButton = document.getElementById('play-again');

const player1Stats = document.getElementById('plr1');
const player2Stats = document.getElementById('plr2');

const preferencesForm = document.getElementById('preferences-form');
const preferencesModule = document.getElementById('preferences-module');
const overlay = document.getElementById('overlay');

const l1 = document.querySelector('.l1');
const l2 = document.querySelector('.l2');
const l3 = document.querySelector('.l3');

const t1 = document.querySelector('.t1');
const t2 = document.querySelector('.t2');
const t3 = document.querySelector('.t3');

const checkCells = [[l1, l2, l3], [t3], [t1, t2, t3], [l1]];

const Player = function(name, sign, statsElement) {
    let points = 0;

    const addPoint = function() {
        points += 1;
    }
    
    const pointsValue = function() {
        return points;
    }
    return {name, sign, statsElement, addPoint, pointsValue};
}

const gameSystem = (function(plr1, plr1Sign, plr2, plr2Sign) {
    const player1 = Player(plr1, plr1Sign, player1Stats);
    const player2 = Player(plr2, plr2Sign, player2Stats);

    const boardGridChildren = Array.from(boardGrid.children);
    let currentChoice = player1;
    let roundStartPlayer = currentChoice;

    const displayPreferences = (function() {
        player1Stats.querySelector('#name').textContent = player1.name;
        player1Stats.querySelector('#sign').textContent = player1.sign;
        player2Stats.querySelector('#name').textContent = player2.name;
        player2Stats.querySelector('#sign').textContent = player2.sign;
    })();

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

        player1Stats.querySelector('#sign').className = '';
        player2Stats.querySelector('#sign').className = '';

    };
    const displayPoints = function() {
        player1Stats.querySelector('#points').textContent = player1.pointsValue();
        player2Stats.querySelector('#points').textContent = player2.pointsValue();
    };

    const colorSigns = function() {
        currentChoice.statsElement.querySelector('#sign').classList.add('winner');
        let otherChoice = (currentChoice == player1) ? player2 : player1;
        otherChoice.statsElement.querySelector('#sign').classList.add('loser');
    };

    const picked = function() {
        if (!this.firstChild) {
            if(placeSign(this) == true) {
                endGame(true);
                currentChoice.addPoint();
                displayPoints();
                colorSigns();
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
});

const ModuleFunc = (function() {
    preferencesForm.onsubmit = moduleData => {
        moduleData.preventDefault();
        overlay.classList.add('disabled');
        preferencesModule.classList.add('disabled');
        const preferences = new FormData(moduleData.target);
        gameSystem(preferences.get('player1Name'), preferences.get('player1Sign').toUpperCase(), preferences.get('player2Name'), preferences.get('player2Sign').toUpperCase());


    };
})();