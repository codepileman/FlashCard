let firstCard = null;
let secondCard = null;

let lockBoard = false;
let cardFlipped =  false;

let started = false;
let matched = 0;

const types = ['aurelia', 'vue', 'angular', 'ember', 'backbone', 'react'];

const parentNode = document.querySelector('.memory-game');

//stop watch
let timeInterval;
const print = function(time){
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let diffInMs = (diffInSec - ss) * 100;
    let ms = Math.floor(diffInMs);

    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(2, "0");

    return `${formattedMM}:${formattedSS}:${formattedMS}`;
}

let timeElement = document.querySelector('.time');
const stopWatchStart = function(){
    //Date.now() returns the number of milliseconds since January 1, 1970 00:00:00 UTC.
    let startTime = Date.now();
    timeInterval = setInterval(() => {
        let elapsedTime = Date.now() - startTime;        
        timeElement.innerHTML = print(elapsedTime);
    }, 10);
}

const stopWatch = function() {
    clearInterval(timeInterval);
}

//flash cards

const render = function() {
    for(let type of types) {
        const template = `<div class="memory-card" data-framework="${type}">
                            <img class="front-face" src="img/${type}.svg" alt="${type}" />
                            <img class="back-face" src="img/js-badge.svg" alt="JS Badge" />
                        </div>`
        parentNode.insertAdjacentHTML('afterbegin', template);
        parentNode.insertAdjacentHTML('afterbegin', template);
    }
}
render();

const cards = document.querySelectorAll('.memory-card');

const flipCard = function(){
    if(started === false){
        started = true;
        stopWatchStart();
    }

    if(lockBoard) return;
    if(firstCard === this) return; //this card already flipped

    this.classList.add('flip');
    if(!cardFlipped){
        firstCard = this;
        cardFlipped = true;
        return
    }

    secondCard = this;
    checkForMatch();  
    
}

const checkForMatch = function(){
    let isMatch = firstCard.getAttribute('data-framework') === secondCard.getAttribute('data-framework');
    if(isMatch) {
        matched++;
        if(matched === types.length) {
            stopWatch();
            document.querySelector('.button').disabled = false;
        }
    }
    isMatch ? disableCards() : unflipCards(); 
}

const disableCards = function() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

const unflipCards = function() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 500);
}

const resetBoard = function() {
    [firstCard, secondCard] = [null, null];
    [cardFlipped, lockBoard] = [false, false];
}; 

function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
}

shuffle();

const addClickEvent = function(){
    cards.forEach(card => {
        card.addEventListener('click', flipCard);
    });
}
addClickEvent();

document.querySelector('.button').addEventListener('click', () => {
    timeElement.innerHTML = '00:00:00';
    started = false;
    matched = 0;
    resetBoard();
    cards.forEach(card => {
        card.classList.remove('flip');
        card.style.order = null;
    })
    shuffle();
    addClickEvent();
    document.querySelector('.button').disabled = true;

});


