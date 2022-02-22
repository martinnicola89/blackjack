/*----- constants -----*/
const suits = ['h', 's', 'd', 'c'];
const values = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const guide = { 
    '02': 2,
    '03': 3,
    '04': 4,
    '05': 5,
    '06': 6,
    '07': 7,
    '08': 8,
    '09': 9,
    '10': 10,
    'J': 10,
    'Q': 10,
    'K': 10,
    'A': 1,
}

/*----- app's state (variables) -----*/
var idx = [];
var dealtCard;
var cards;
var [playerTotal, cpuTotal] = [0, 0];
var [storedPlayerCards, storedCpuCards] = [[], []]
var stand = false;
var blackjack = false;
var playerWins = false;
var cpuWins = false;
var draw = false;
var newElem;
var playedElems = []

/*----- cached element references -----*/
var hitBtnEl = document.getElementById("hit-card-btn");
var standBtnEl = document.getElementById("stand-card-btn");
var resetBtnEl = document.getElementById("reset-btn");
var playerCards = Array.from(document.querySelectorAll('#player-card'));
var cpuCards = Array.from(document.querySelectorAll('#cpu-card'));
var playerTally = document.querySelector('.player-tally');
var cpuTally = document.querySelector('.cpu-tally');
var winMessage = document.querySelector('.win-message');

/*----- event listeners -----*/
hitBtnEl.addEventListener('click', (evt) => handleClick(evt));
standBtnEl.addEventListener('click', (evt) => handleClick(evt));
resetBtnEl.addEventListener('click', init);

init()

/*----- functions -----*/
function init() {
    [storedPlayerCards, storedCpuCards] = [[], []]
    stand = false;
    blackjack = false;
    playerWins = false;
    cpuWins = false;
    draw = false;
    cpuTotal = 0;
    playerTotal = 0;
    playedElems.forEach(elem => {
        if (elem.id == 'player-card') {
            document.querySelector('.player-inPlay-container').removeChild(elem);
        } else {
            document.querySelector('.cpu-inPlay-container').removeChild(elem);
        }
    })
    shuffleDeck();
    playerDealt();
    computerDealt();
    calculate();
    render();
}

function playerDealt() {
    playerCards.forEach(playerCard => {
        idx.push(Math.floor(Math.random()*cards.length))
        dealtCard = cards[idx[idx.length-1]]
        storedPlayerCards.push(dealtCard)
        playerCard.className = `card large ${dealtCard}`
        removeFromDeck(dealtCard);
    })
    idx = []
}

function computerDealt() {
    cpuCards.forEach(cpuCard => {
        idx.push(Math.floor(Math.random()*cards.length))
        dealtCard = cards[idx[idx.length-1]]
        storedCpuCards.push(dealtCard)
        removeFromDeck(dealtCard);
    })
    cpuCards[1].className = `card large ${dealtCard}`
    idx = []
}

function removeFromDeck(incomingCard) {
    cards = cards.filter(card => card !== incomingCard);
}

function shuffleDeck() {
    cards = [];
    suits.forEach(suit => values.forEach(value => cards.push(suit+value)));
    cards = cards.sort(() => 0.5 - Math.random());
}

function calculate() {
    storedPlayerCards.forEach(playerCard => {
        playerTotal += guide[playerCard.substring(1)]
    })
     if (stand) {
        cpuTotal = 0;
         storedCpuCards.forEach(cpu => {
            cpuTotal += guide[cpu.substring(1)]
        })     
    }
     if (playerTotal == 11 && (storedPlayerCards.includes('hA') || storedPlayerCards.includes('cA') || storedPlayerCards.includes('dA') || storedPlayerCards.includes('sA'))) {
         playerTotal = 21;
         blackjack = true;
     } else if (playerCards.length == 2 && (storedPlayerCards.includes('hA') || storedPlayerCards.includes('cA') || storedPlayerCards.includes('dA') || storedPlayerCards.includes('sA'))) {
         playerTotal += 10;
     }
     if (playerTotal > 21) cpuWins = true;
     else if (cpuTotal > 21) playerWins = true;
     else if (playerTotal > cpuTotal && stand) playerWins = true;
     else if (cpuTotal > playerTotal && stand) cpuWins = true;
     else if (cpuTotal == playerTotal && stand) draw = true;
}

function render() {
    playerTally.innerText = `Player Total: ${playerTotal}`
    cpuTally.innerText = `CPU Total: ${cpuTotal}`
    playerTotal = 0;
    if (stand) cpuCards[0].className = `card large ${storedCpuCards[0]}`
    else cpuCards[0].className = `card large back-red`
    if (blackjack || playerWins) winMessage.innerText = 'Player wins!'
    else if (cpuWins) winMessage.innerText = 'House wins!'
    else if (draw) winMessage.innerText = 'Draw';
    else {
        
        winMessage.innerText = '';
    }
}

function handleClick(evt) {
    if (evt.target.id.includes("stand")) {
        handleStand();
    } else {
        handleHit(storedPlayerCards, '.player-inPlay-container', 'player-card');
    }
}

function handleStand() {
    stand = true;
    while (cpuTotal < 17) {
        handleHit(storedCpuCards, '.cpu-inPlay-container', 'cpu-card')
    }
    if (playerTotal > cpuTotal && playerTotal <= 21) playerWins = true;
    else if (cpuTotal > playerTotal && cpuTotal <= 21) cpuWins = true;
    calculate();
    render();
}

function handleHit(incomingCards, incomingContainer, incomingId) {
    let hitIdx = Math.floor(Math.random()*cards.length)
    dealtCard = cards[hitIdx]
    newElem = document.createElement('div')
    newElem.className = `card large ${dealtCard}`
    newElem.id = incomingId
    playedElems.push(newElem);
    document.querySelector(incomingContainer).appendChild(newElem);
    incomingCards.push(dealtCard)
    removeFromDeck(dealtCard);
    calculate();
    render();
}