const dealBtn = document.querySelector('#dealBtn')
const hitBtn = document.querySelector('#hitBtn')
const standBtn = document.querySelector('#standBtn')
const doubleDownBtn = document.querySelector('#doubleDownBtn')
const splitBtn = document.querySelector('#splitBtn')
const result = document.querySelector('#result')

class Participant{
    constructor(name){
        this.name = name
        this.cash = 1000
        this.wins = 0
        this.currentBet = 0
        this.handValue = 0
        this.handArray = []
        this.stand = false
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
            document.querySelector('#dealerHand').innerText = `Hand: ${this.handValue}`
        }else{
            document.querySelector('#playerHand').innerText = `Hand: ${this.handValue}`
        }
    }
}
// public, private methods???

//create dealer and player for now, input later for multiple players
const dealer = new Participant('Dealer')
const player = new Participant('Player')


let deckId = ''
function getNewDeck(){
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
}
//delete once organised
getNewDeck()


function deal(){
    if(document.querySelector('img')){
        Array.from(document.querySelectorAll('img')).forEach(e => e.remove())
    }
    result.innerText = ''
    dealer.handArray = []
    player.handArray = []
    dealer.handValue = 0
    player.handValue = 0
    player.stand = false
    hitBtn.style.display = 'flex'
    standBtn.style.display = 'flex'
    doubleDownBtn.style.display = 'flex'
    dealBtn.style.display = 'none'
    drawCards(1, 'dealer')
        .then(v => dealer.playerHandArray(v))
        .then(v => checkResult(v))
        .then(a => drawCards(2, 'player'))
        .then(v => player.playerHandArray(v))
        .then(v => checkResult(v))

}
function hit(){
    drawCards(1, 'player')
        .then(v => player.playerHandArray(v))
        .then(v => checkResult(v))
}
function stand(){
    if(dealer.handValue < 17){
        drawCards(1, 'dealer')
            .then(v => dealer.playerHandArray(v))
            .then(v => checkResult(v))
            .then(a => stand())
        }
    player.stand = true
}
function doubleDown(){
    drawCards(1, 'player')
        .then(v => player.playerHandArray(v))
        .then(v => checkResult(v))
    //double bet size
}
function split(){
    //double bet size
}

function checkResult(){
    if(player.handValue === 21){
        endGame('player wins!!')
    }else if(player.handValue > 21){
        endGame('player bust')
    }else if(dealer.handValue > 21){
        endGame('dealer bust')
    }else if(dealer.handValue > player.handValue && player.stand === true){
        endGame('dealer wins')
    }else if(dealer.handValue < player.handValue && player.stand === true && dealer.handValue > 16){
        endGame('player wins')
    }else if(dealer.handValue === player.handValue && player.stand === true && dealer.handValue > 16){
        endGame('tie')
    }else{
        return
    }
}

function endGame(gameResult){
    result.innerText = gameResult
    hitBtn.style.display = 'none'
    standBtn.style.display = 'none'
    doubleDownBtn.style.display = 'none'
    splitBtn.style.display = 'none'
    dealBtn.style.display = 'flex'
}

function drawCards(numOfCards, user){
    const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numOfCards}`
    const cardValues = fetch(url)
        .then(res => res.json())
        .then(data => {
            const container = document.querySelector(`#${user}ImgContainer`)
            let cardValues = []
            document.querySelector('#deck').innerText = data.remaining
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

function cardValue(val){
    if(val === 'ACE'){
        return [11]
    }else if (val === 'KING' || val === 'QUEEN' || val === 'JACK'){
        return 10
    }else{
        return val
    }
}

dealBtn.addEventListener('click', deal)
hitBtn.addEventListener('click', hit)
standBtn.addEventListener('click', stand)
doubleDownBtn.addEventListener('click', doubleDown)
splitBtn.addEventListener('click', split)

// keep bet amount, winnings, losses, and add to local storage
// default img for upside down card
// when deck runs out, grab new deck
// card count logic
