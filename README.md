Number draw system

This project is a real-time number draw system where users can join a draw and select a number or numbers. 
An admin controls the draw through API calls, including opening and starting the draw, and the results are shared with all users.
Using WebSocket (https://socket.io/), users can see the draw status and results live in real time.

## Setup
1. Install dependencies using `npm install`
2. Create `.env` file in the root of the project and define the following environment variables:
`PORT`, `MONGODB_URI` and  `API_KEY`
3. Start the server using `npm run dev` for development mode or `npm start` for production
