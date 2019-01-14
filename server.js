const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

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

app.get('/api/events', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  return res.send({
    rows: await knex("events").select().offset((page - 1) * 10).limit(10),
    total: (await knex("events").count("* as cnt").first()).cnt,
  }).status(200);
});

app.listen(process.env.PORT || 8080);