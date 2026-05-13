const socket = io();

// Placeholder amount of guesses in a draw round. May be changed dynamically in the future
const ROUND_GUESS_NUMBER_COUNT = 20;

// Map containing local guess data.
// key is the guess number, value is an object with properties 'state' and 'owner'
// 'state' is either 'reserved-me' or 'reserved-other'
// 'owner' has the socked id of client who made the guess
// Ex. guessData.get(2) = { 'state': 'reserved-me', owner: 'V8uOTo85UY9k4BdMAAAD'}
const guessData = new Map();

// ONLY for debugging purposes. Remove when WebSocket calls updating guess states is implemented.
guessData.set(2, { state: "reserved-me", owner: "test"});
guessData.set(9, { state: "reserved-other", owner: "test2" });

// Container element for guess buttons
const guessButtonsElement = document.getElementById("guess-buttons");
// Array of guess button elements
let guessButtonsElementArray = new Array();

// Object storing socket_id and token for authentication
let clientInfo = {};

// When WebSocket connection is established
socket.on("connect", () => {
    console.log("Connected to socket:", socket.id);
    clientInfo.socket_id = socket.id;
});

// Server returns an authentication token shortly after WebSocket connection is established
socket.on("auth_token", (token) => {
    console.log("Received token:", token);
    clientInfo.token = token;
});

// Server sends a WebSocket message when draw round is opened
socket.on("draw_open", data => {
    console.log("Draw opened:", data);
    // Get view elements
    const drawClosedView = document.getElementById("draw-closed-view");
    const drawOpenView = document.getElementById("draw-open-view");
    // Hide closed draw view
    drawClosedView.style.display = "none";
    // Show open draw view
    drawOpenView.style.display = "block";

});

// Server sends a WebSocket message when other user makes a guess
socket.on("guess_addition", data => {
    console.log("addition", data);

    guessData.set(parseInt(data.number), {
        state: "reserved-other",
        owner: data.socketId,
    });
    updateGuessButtonElements();
});

// Server sends a WebSocket message when other user removes a guess
socket.on("guess_removal", data => {
    console.log("removal", data);

    guessData.remove(parseInt(data.number));
    updateGuessButtonElements();
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
        guess = guessData.get(number);

        // Remove current state
        buttonElement.classList.remove("open", "reserved-me", "reserved-other");

        // Add state css class based on state in guessStates map
        if (!guess) {
            buttonElement.classList.add("open");
        } else {
            buttonElement.classList.add(guess.state);
        }
    });
}

createGuessButtonElements();
updateGuessButtonElements();
