//globals
let randomNumber;
let attempts = 0;
let wins = 0;
let losses = 0;

const moodFace = document.querySelector("#moodFace");
const revealBox = document.querySelector("#revealAnswer");

document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

document.querySelector("#playerGuess").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        checkGuess();
    }
});

initializeGame();

function initializeGame() {
    randomNumber = Math.floor(Math.random() * 99) + 1;
    console.log("Random Number is " + randomNumber);
    attempts = 0;
    
    document.querySelector("#resetBtn").style.display = "none";
    document.querySelector("#guessBtn").style.display = "inline";

    let playerGuess = document.querySelector("#playerGuess");
    playerGuess.focus();
    playerGuess.value = "";

    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";
    feedback.className = "feedback";

    let attemptsDisplay = document.querySelector("#attemptsDisplay");
    attemptsDisplay.style.display = "inline";
    attemptsDisplay.textContent = "You have 7 attempts";

    document.querySelector("#guesses").textContent = "";

    const winLossDisplay = document.querySelector("#winLossDisplay");
    winLossDisplay.textContent = "Wins: " + wins + " | Losses: " + losses;

    revealBox.hidden = true;
    revealBox.textContent = "";

    setFace("happy");
    clearConfetti();
}

function checkGuess() {
    let guess = document.querySelector("#playerGuess").value.trim();
    let feedback = document.querySelector("#feedback");
    let attemptsDisplay = document.querySelector("#attemptsDisplay");

    feedback.textContent = "";

    console.log("Player Guess: " + guess);

    if (!Number.isInteger(parseInt(guess)) || guess < 1 || guess > 99) {
        feedback.textContent = "Enter a number between 1 and 99";
        feedback.style.color = "red";
        return;
    }

    attempts++;
    setFace("thinking");
    console.log("Attempts: " + attempts);
    feedback.style.color = "orange";

    if (guess == randomNumber) {
        //you win
        feedback.textContent = "You win!";
        feedback.style.color = "green";
        attemptsDisplay.textContent = "You won in " + attempts + " attempt(s)!";
        setFace("win");
        launchConfetti();
        wins++;
        gameOver();
    }
    else {
        document.querySelector("#guesses").textContent += guess + " ";
        if (attempts == 7) {
            //you lose
            feedback.textContent = "Sorry, you lost!";
            feedback.style.color = "red";
            
            revealBox.textContent = "The correct number was " + randomNumber;
            revealBox.hidden = false;

            attemptsDisplay.style.display = "none";
            setFace("lose");
            losses++;
            gameOver();
        } else if (guess > randomNumber) {
            feedback.textContent = "Guess was too high";
            guessAgain();
        }
        else {
            feedback.textContent = "Guess was too low";
            guessAgain();
        }
    }
}

function guessAgain() {
    attemptsDisplay.textContent = "You have " + (7-attempts) + " attempt(s) left."
    document.querySelector("#playerGuess").value = "";
    playerGuess.focus();
}

function gameOver() {
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");
    guessBtn.style.display = "none";
    resetBtn.style.display = "inline";
}

function setFace(state){
    switch(state){
        case "thinking":
            moodFace.src = "img/faceThinking.gif";                
            moodFace.classList.add("thinking");
            break;
        case "win":
            moodFace.src = "img/faceCheer.png";
            moodFace.classList.remove("thinking");
            break;
        case "lose":
            moodFace.src = "img/faceSad.png";
            moodFace.classList.remove("thinking");
            break;
        case "happy":
            moodFace.src = "img/faceHappy.png";
            moodFace.classList.remove("thinking");
            break;
        default:
            moodFace.src = "img/faceHappy.png";
            moodFace.classList.remove("thinking");
            break;
    }
}

function launchConfetti(count = 80, duration = 3000){
  clearConfetti();
  const w = window.innerWidth;

  for (let i = 0; i < count; i++){
    //the wrapper falls
    const wrapper = document.createElement("div");
    wrapper.className = "confetti";

    //the shape itself spins and shows color
    const shape = document.createElement("span");
    shape.className = "confetti-shape";

    //random timing
    const startX   = Math.random() * w;
    const size     = 8 + Math.random() * 10;
    const fallTime = 2.4 + Math.random() * 1.6;
    const spinTime = 0.8 + Math.random() * 1.8;
    const delay    = Math.random() * 0.4; 

    //random color
    const hue  = Math.floor(Math.random() * 360);
    const sat  = 85 + Math.random()*10;
    const lite = 55 + Math.random()*10;
    shape.style.color = `hsl(${hue} ${sat}% ${lite}%)`;

    //position and sizing
    wrapper.style.left = `${startX}px`;
    wrapper.style.animationDuration = `${fallTime}s`;
    wrapper.style.animationDelay = `${delay}s`;

    shape.style.width  = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.animationDuration = `${spinTime}s`;

    wrapper.appendChild(shape);
    confettiLayer.appendChild(wrapper);
  }

  // cleanup after show
  setTimeout(clearConfetti, duration + 1000);
}

function clearConfetti(){
  while (confettiLayer.firstChild) confettiLayer.removeChild(confettiLayer.firstChild);
}
