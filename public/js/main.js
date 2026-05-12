const socket = io();

// Placeholder amount of guesses in a draw round. May be changed dynamically in the future
const ROUND_GUESS_NUMBER_COUNT = 20;

// Map containing local guess states (open, reserverved-me, reserved-other)
// Ex. guessStates(1) returns 'open', 'reserved-me' or 'reserved-other'
const guessStates = new Map();

// ONLY for debugging purposes. Remove when WebSocket calls updating guess states is implemented.
guessStates.set(2, "reserved-me");
guessStates.set(5, "open");
guessStates.set(9, "reserved-other");

// Container element for guess buttons
const guessButtonsElement = document.getElementById("guess-buttons");
// Array of guess button elements
let guessButtonsElementArray = new Array();

// When WebSocket connection is established
socket.on("connect", () => {
  console.log("Connected to socket:", socket.id);
});

// Server returns an authentication token shortly after WebSocket connection is established
socket.on("auth_token", (token) => {
  console.log("Received token:", token);
});

socket.on("guess_addition", guessData => {
    console.log("addition", guessData);
});

socket.on("guess_removal", guessData => {
    console.log("removal", guessData)
})

// When user clicks on a guess button
const handleGuessClick = (event) => {
    const guessButtonElement = event.target;
    console.log(guessButtonElement.value);
}

// Create guess button elements
const createGuessButtonElements = () => {
    const fragment = document.createDocumentFragment();

    // Create button elements and bind eventlisteners
    for (let i = 0; i < ROUND_GUESS_NUMBER_COUNT; i++) {
        const guessButton = document.createElement('button');
        guessButton.textContent = i;
        guessButton.value = i;
        guessButton.className = 'guess-button';
        guessButton.addEventListener("click", handleGuessClick);
        fragment.appendChild(guessButton);
        guessButtonsElementArray.push(guessButton);
    }

    guessButtonsElement.appendChild(fragment);
}

// Update guess button element classes
const updateGuessButtonElements = () => {
    guessButtonsElementArray.forEach((buttonElement) => {
        const number = parseInt(buttonElement.value);
        state = guessStates.get(number);

        // Remove current state
        buttonElement.classList.remove("open", "reserved-me", "reserved-other");

        // Add state css class based on state in guessStates map
        if (!state) {
        buttonElement.classList.add("open");
        } else {
        buttonElement.classList.add(state);
        }
    });
}

createGuessButtonElements();
updateGuessButtonElements();
