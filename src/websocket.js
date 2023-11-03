const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('A new client connected');

  // Handle incoming chat messages
  ws.on('message', (message) => {
    console.log(`Received chat message => ${message}`);

    // Broadcast the chat message to all clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('A client disconnected');
  });
});
