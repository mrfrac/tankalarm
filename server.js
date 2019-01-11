const express = require('express');
const path = require('path');
const knex = require('knex')({
  client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./db.sqlite",
      debug: true
    }
});

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', (req, res) => {
  return res.send('pong');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api/event_types', async (req, res) => {
  const types = await knex("event_types").select();
  res.send(types).status(200);
});

app.listen(process.env.PORT || 8080);