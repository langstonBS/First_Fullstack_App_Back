require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

app.get('/books', async(req, res) => {
  const data = await client.query(`
  SELECT books.id, books.book_title, books.did_read, books.scale, books.discription, users.email
  FROM books
  JOIN users
  ON books.owner_id = users.id
  `);
  res.json(data.rows);
});


app.get('/books/:id', async(req, res) => {
  const id = req.params.id;
  const data = await client.query(`
  SELECT books.id, books.book_title, books.did_read, books.scale, books.discription, users.email
  FROM books
  JOIN users
  ON books.owner_id = users.id
  WHERE books.id =$1`
  , [id]
  );
  
  res.json(data.rows[0]);
});

app.post('/books/', async(req, res) => {
  try {
    const data = await client.query(`
  INSERT INTO  books (book_title, did_read, scale, discription, owner_id)
 VALUES ($1,$2,$3,$4,$5)
 RETURNING *;`,
    [req.body.book_title, req.body.did_read, req.body.scale, req.body.discription, req.body.owner_id]
    );
    res.json(data);
  } catch(e) {
    console.error(e);
    res.json(e);
  }
});



app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;
