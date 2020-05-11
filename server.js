require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

app.get('/books', async(req, res) => {
  const data = await client.query('SELECT * from books');

  res.json(data.rows);
});

app.get('/books/:id', async(req, res) => {
  const data = await client.query('SELECT book_title.id, scale.id, discription.id FROM books WHERE books.id = $1 ', [req.params.id]);
  res.json(data.rows[0]);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;
