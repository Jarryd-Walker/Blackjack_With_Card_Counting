// create player objects

class Participant{
    constructor(name){
        this.name = name
        this.cash = 1000
        this.wins = 0
        this.currentBet = 0
        this.handValue = 0
        this.handArray = []
    }

    increaseWin(){
        this.wins++
    }
    playerHandArray(newCards){
        this.handArray = this.handArray.concat(newCards)
        if(this.handArray.reduce((a,b) => a + b, 0) > 21){
            const aceIndex = this.handArray.indexOf(11)
            if(aceIndex !== -1){
                this.handArray[aceIndex] = 1
            }
        }
        this.calculateHandValue(this.handArray)
    }
    calculateHandValue(handArray){
        this.handValue = handArray.reduce((a,b) => a + b, 0)
        console.log(this.handValue)
        if(this === dealer){
            document.querySelector(`#dealerHand`).innerText = `${this.name} hand: ${this.handValue}`
        }else{
            document.querySelector(`#playerHand`).innerText = `${this.name} hand: ${this.handValue}`
        }
    }
    
}
// public, private methods???

//create dealer and player for now, input later for multiple players
const dealer = new Participant('Dealer')
const player1 = new Participant('Player1')

// get deck

let deckId = ''

fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res => res.json())
    .then(data => {
        deckId = data.deck_id
    })
    .catch(err => {
        console.log(`error ${err}`)
    })

// start game and setup function, deal 2 cards each, 1 face down for dealer

document.querySelector('button').addEventListener('click', deal)

function deal(){
    //reset images
    dealer.handValue = 0
    player1.handValue = 0
    document.querySelector('#hitBtn').style.display = 'flex'
    document.querySelector('#dealBtn').style.display = 'none'
    drawCards(1, 'dealer').then(v => dealer.playerHandArray(v))
    drawCards(2, 'player').then(v => player1.playerHandArray(v))
}

document.querySelector('#hitBtn').addEventListener('click', hit)
document.querySelector('#standBtn').addEventListener('click', stand)
document.querySelector('#doubleDownBtn').addEventListener('click', doubleDown)

function hit(){
    drawCards(1, 'player').then(v => player1.playerHandArray(v))
}
function stand(){
    // if player > 21 player lose, need to add
    if(dealer.handValue > 21){
        return console.log('dealer bust');
    }else if(dealer.handValue > player1.handValue){
        return console.log('dealer wins')
    }else if(dealer.handValue < 17){
        drawCards(1, 'dealer').then(v => dealer.playerHandArray(v)).then(a => {
            stand()
        })
    }else if(dealer.handValue < player1.handValue){
        return console.log('player wins');   
    }else if(dealer.handValue === player1.handValue){
        return console.log('tie');    
    }
}
function doubleDown(){

}

// function to draw cards

function drawCards(numOfCards, user){
    const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numOfCards}`
    const cardValues = fetch(url)
        .then(res => res.json())
        .then(data => {
            const container = document.querySelector(`#${user}ImgContainer`)
            let cardValues = []
            for(let i = 0; i < numOfCards; i++){
                const content = document.createElement('img')
                container.appendChild(content)
                content.src = data.cards[i].image
                cardValues.push(Number(cardValue(data.cards[i].value)))
                }
            return cardValues
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
    return cardValues
}

// calculate card value

function cardValue(val){
    if(val === 'ACE'){
        return [11]
    }else if (val === 'KING' || val === 'QUEEN' || val === 'JACK'){
        return 10
    }else{
        return val
    }
}

// function to hit, double down, stand, or split
// keep hand score, dealer score, bet amount, winnings, losses, and add to local storage
// default img for upside down card

// card count logic



