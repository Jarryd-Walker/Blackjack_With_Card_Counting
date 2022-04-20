let deckId = ''

fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => res.json())
      .then(data => {
        deckId = data.deck_id
      })
      .catch(err => {
          console.log(`error ${err}`)
      })

document.querySelector('button').addEventListener('click', startGame)

// create player objects
// function to draw cards
// start game and setup function
// function to hit, double down, stand, or split
// keep hand score, dealer score, bet amount, winnings, losses, and add to local storage
// default img for upside down card

// card count logic

function drawCards(numOfCards){
  const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numOfCards}`
  fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        let val = Number(cardValue(data.cards[0].value))
        document.querySelector('#dealerImg1').src = data.cards[0].image

      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

function cardValue(val){
  if(val === 'ACE' && handScore > 10){
    return 11
  }else if(val === 'ACE'){
    return 1
  }else if (val === 'KING' || val === 'QUEEN' || val === 'JACK'){
    return 10
  }else{
    return val
  }
}