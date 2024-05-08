const WebSocket = require("ws");

// Initialize the WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// List of connected WebSocket clients
const clients = [];

// Function to send a message to all connected WebSocket clients
function broadcastMessage(message) {
  const data = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// WebSocket connection event
wss.on("connection", function connection(ws) {
  console.log("New connection WebSocket.");

  // Adds the client to the list of connected clients
  clients.push(ws);

  // Message received event
  ws.on("message", function incoming(message) {
    console.log("Message received: %s", message);

    // Here you can process the received message if necessary
  });

  // Connection close event
  ws.on("close", function close() {
    console.log("Connection closed.");
    
    // Removes the client from the list of connected clients
    clients.splice(clients.indexOf(ws), 1);
  });
});

module.exports = { wss, broadcastMessage };
