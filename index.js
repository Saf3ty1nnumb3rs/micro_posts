const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const APP_PORT = 4000;
// no db for toy app
const posts = {};

// POSTS
app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = { id, title };

  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: { id, title },
  }).catch((err) => {
    console.log(err.message);
  });
  res.status(201).send(posts[id]);
});

// EVENTS
app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);

  res.send({});
});

app.listen(APP_PORT, () => {
  console.log(`Listening on ${APP_PORT}`);
});
