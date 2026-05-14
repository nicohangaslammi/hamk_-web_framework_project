const socket = io();

// Placeholder amount of guesses in a draw round. May be changed dynamically in the future
const ROUND_GUESS_NUMBER_COUNT = 20;

// Map containing local guess data.
// key is the guess number, value is an object with properties 'state' and 'owner'
// 'state' is either 'reserved-me' or 'reserved-other'
// 'owner' has the socked id of client who made the guess
// Ex. guessData.get(2) = { 'state': 'reserved-me', 'owner': 'V8uOTo85UY9k4BdMAAAD'};
const guessData = new Map();

// Container element for guess buttons
const guessButtonsElement = document.getElementById("guess-buttons");
// Array of guess button elements
let guessButtonsElementArray = new Array();
// Current active draw round ID
let drawRoundId;

// Object storing socket_id and token for authentication
// Ex. what clientInfo looks like after WebSocket handshake
// clientInfo = { 'socket_id': 'V8uOTo85UY9k4BdMAAAD', 'token': 'ni8-X9BE5GoZnTcfAAAD' };
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

    guessData.delete(parseInt(data.number));
    updateGuessButtonElements();
})

// When user clicks on a guess button
const handleGuessClick = async (event) => {
    // Get selected number from clicked button
    const number = parseInt(event.target.value);
    // Check if number is already reserved
    const guess = guessData.get(number);
    // Send request if number is available
    if (!guess) {
    // Create request body
    const requestBody = {
        draw_round: drawRoundId,
        number: number
    };
    // Create request header for authentication
    const config = {
        headers: {
            'Authorization': 'Bearer ' + clientInfo.token,
            'x-socket-id': clientInfo.socket_id
        }
    };
    try {
        // Send POST request
        const response = await axios.post('/api/guesses', requestBody, config);
        // Update button if request succeeds
        if (response.status === 200) {
            guessData.set(number, {
                state: "reserved-me",
                owner: clientInfo.socket_id
            });
            updateGuessButtonElements();
        }
    } catch(error) {
        console.log(error);
        }
    }
// If number is reserved by me, remove guess
else if (guess.state === "reserved-me") {
    const requestBody = {
        draw_round: drawRoundId,
        number: number
    };
    try {
        // Send DELETE request
        const response = await axios.delete('/api/guesses', {
        headers: {
            'Authorization': 'Bearer ' + clientInfo.token,
            'x-socket-id': clientInfo.socket_id
        }, 
        data: requestBody
    }); 
    if (response.status === 200) {
        guessData.delete(number);
        updateGuessButtonElements();
    }
    } catch(error) {
        console.log(error);
        }
    }
    else {
        console.log("Number is already reserved."); 
    }
};

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
        const guess = guessData.get(number);

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

// Get active round with API call. Only called on when page loads for the first time.
const getActiveRound = async () => {
    try {
        const response = await axios.get('/api/rounds');

        // Create guess button elements
        createGuessButtonElements();

        // Store active round id
        drawRoundId = response.data._id;

        // Store active round guesses to guessData map
        response.data.guesses.forEach( guess => {
            const data = {
                state: 'reserved-other',
                owner: guess.socket_id
            };
            guessData.set(guess.number, data);
        });
    } catch (error) {
        console.error(error);
    }

    updateGuessButtonElements();
}

getActiveRound();
