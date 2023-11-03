const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(morgan('tiny'));

// Create a basic chat API route
app.post('/chat', (req, res) => {
  const message = req.body.message;
  console.log(`Received chat message => ${message}`);
  
  // You can implement chat-related logic here, e.g., saving messages or processing them.
  
  res.status(201).send('Chat message received successfully');
});

// Start the server
app.listen(port, () => {
  console.log(`Chat server listening at http://localhost:${port}`);
});
