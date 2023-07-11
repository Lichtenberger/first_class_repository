// get the game container element
const gameContainer = document.getElementById("game");

// initialize some variables to keep track of the game state
let card1 = null;
let card2 = null;
let cardsFlipped = 0;
let noClicking = false;
let attempts = 0; // new variable to count the attempts
let lowScore = 0; // new variable to store the low score

// define an array of colors for the cards
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow"
];

// use a helper function to shuffle the array of colors
// this is based on the Fisher Yates algorithm
function shuffle(array) {
  // loop over the array from the end to the beginning
  for (let i = array.length - 1; i > 0; i--) {
    // pick a random index from 0 to i
    let j = Math.floor(Math.random() * (i + 1));
    // swap the elements at i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  // return the shuffled array
  return array;
}

// shuffle the colors array and store it in a new variable
let shuffledColors = shuffle(COLORS);

// create a function that loops over the array of colors and creates divs for each color
function createDivsForColors(colorArray) {
  // use a for...of loop to iterate over the colorArray
  for (let color of colorArray) {
    // create a new div element
    const newDiv = document.createElement("div");
    // add a class attribute with the value of the color
    newDiv.classList.add(color, "notFlipped");
    // add a click event listener that calls the handleCardClick function
    newDiv.addEventListener("click", handleCardClick);
    // append the new div to the game container element
    gameContainer.append(newDiv);
  }
}

// create a function that handles the logic of clicking on a card
function handleCardClick(e) {
  // get the clicked element from the event object
  let currentCard = e.target;
  
  // if noClicking is true or the currentCard is already flipped, return early
  if (noClicking || currentCard.classList.contains("flipped")) return;
  
  // change the background color of the currentCard to match its class name
  currentCard.style.backgroundColor = currentCard.classList[0];
  
  // if card1 or card2 are null, assign them to the currentCard and add the flipped class
  if (!card1 || !card2) {
    currentCard.classList.add("flipped");
    card1 = card1 || currentCard;
    card2 = currentCard === card1 ? null : currentCard;
  }

  // if both card1 and card2 are assigned, check if they match
  if (card1 && card2) {
    // set noClicking to true to prevent further clicks until cards are reset
    noClicking = true;
    
    // get the class names of card1 and card2
    let gif1 = card1.className;
    let gif2 = card2.className;
    
    // increment attempts by one every time two cards are flipped
    attempts++;
    
    // update the text content of the attempts element with the current value of attempts
    document.getElementById("attempts").textContent = `Attempts: ${attempts}`;
    
    // if they match, increment cardsFlipped by 2 and remove the click event listeners from them
    if (gif1 === gif2) {
      cardsFlipped += 2;
      card1.removeEventListener("click", handleCardClick);
      card2.removeEventListener("click", handleCardClick);
      
      // reset card1 and card2 to null and noClicking to false
      card1 = null;
      card2 = null;
      noClicking = false;
      
      // if all cards are flipped, alert game over and show how many attempts it took
      if (cardsFlipped === COLORS.length) {
        alert(`Game over! You matched all cards in ${attempts} attempts.`);
        
        // check if there is a low score stored in localStorage and parse it as a number
        let storedLowScore = Number(localStorage.getItem("memory-game-low-score"));
        
        // if there is no low score or the current attempts is lower than the stored low score, update the low score with the current attempts
        if (!storedLowScore || attempts > storedLowScore) {
          localStorage.setItem("memory-game-low-score", attempts);
          lowScore = attempts;
        }
        
        // update the text content of the low score element with the current value of low score
        document.getElementById("low-score").textContent = `Low Score: ${lowScore}`;
      }
      
    // if they don't match, use setTimeout to flip them back after one second  
    } else {
      setTimeout(function() {
        // reset the background colors and remove the flipped class from both cards
        card1.style.backgroundColor = "";
        card2.style.backgroundColor = "";
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        
        // reset card1 and card2 to null and noClicking to false
        card1 = null;
        card2 = null;
        noClicking = false;
      }, 1000);
    }
    
   
}
}

// when the DOM loads, call the createDivsForColors function with the shuffledColors array as an argument
createDivsForColors(shuffledColors);

// create a new element to display the attempts on the screen
const attemptsElement = document.createElement("p");
// give it an id of "attempts"
attemptsElement.id = "attempts";
// set its initial text content to "Attempts: 0"
attemptsElement.textContent = "Attempts: 0";
// append it to the game container element
gameContainer.append(attemptsElement);

// create a new element to display the low score on the screen
const lowScoreElement = document.createElement("p");
// give it an id of "low-score"
lowScoreElement.id = "low-score";
// check if there is a low score stored in localStorage and parse it as a number
let storedLowScore = Number(localStorage.getItem("memory-game-low-score"));
// if there is a stored low score, assign it to the lowScore variable and set the text content of the low score element accordingly
if (storedLowScore) {
  lowScore = storedLowScore;
  lowScoreElement.textContent = `Low Score: ${lowScore}`;
// otherwise, set the text content of the low score element to "Low Score: N/A"
} else {
  lowScoreElement.textContent = "Low Score: N/A";
}
// append it to the game container element
gameContainer.append(lowScoreElement);

// create a new element for the reset button
const resetButton = document.createElement("button");
// give it an id of "reset"
resetButton.id = "reset";
// set its text content to "Reset Game"
resetButton.textContent = "Reset Game";
// add a click event listener that calls the resetGame function
resetButton.addEventListener("click", resetGame);
// append it to the game container element
gameContainer.append(resetButton);

// create a function that resets the game state and UI
  function resetGame() {
    window.location.reload();
  }
