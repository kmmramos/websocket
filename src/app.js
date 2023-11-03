const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(morgan('tiny'));

// Create a WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('A new client connected');

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);

    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('A client disconnected');
  });

  // Error handling for individual WebSocket connections
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    // Handle the error or take necessary action
  });
});

// Create a RESTful API server
// Create a resource
app.post('/resources', (req, res) => {
  console.log(`Creating resource => ${JSON.stringify(req.body)}`);
  res.status(201).send('Resource created successfully');
});

// Read a resource
app.get('/resources/:id', (req, res) => {
  console.log(`Reading resource with id => ${req.params.id}`);
  res.status(200).send(`Resource with id ${req.params.id} found`);
});

// Delete a resource
app.delete('/resources/:id', (req, res) => {
  console.log(`Deleting resource with id => ${req.params.id}`);
  res.status(204).send();
});

// Error handling for the Express app
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  // Handle Express-specific errors here
  res.status(500).send('Internal Server Error');
});

// Create an HTTP server that integrates both WebSocket and RESTful API servers
const server = app.listen(port, () => {
  console.log(`HTTP server listening at http://localhost:${port}`);
});

// Create a WebSocket server that integrates with the HTTP server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Error handling for the server
server.on('error', (error) => {
  console.error('Server error:', error);
  // Handle server-related errors here
});
