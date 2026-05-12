const socket = io();

socket.on("connect", () => {
  console.log("Connected to socket:", socket.id);
});

socket.on("auth_token", (token) => {
  console.log("Received token:", token);
});
