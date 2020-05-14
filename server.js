require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

app.get('/genre', async(req, res) => {
  try {
    const data = await client.query(`
  SELECT *
  FROM genre `);
    res.json(data.rows);
  } catch(e) {
    res.json(e);
  }
});

app.get('/books', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT books.id, books.book_title, books.did_read, books.scale, books.discription, genre.book_genre, users.email
    FROM books
    JOIN users ON books.owner_id = users.id
    JOIN genre ON genre.id = books.genre
  `);
    res.json(data.rows);
  } catch(e) {
    res.json(e);
  }
});


app.get('/books/:id', async(req, res) => {
  try {
    const data = await client.query(`
  SELECT books.id, books.book_title, books.did_read, books.scale, books.discription, genre.book_genre, users.email
  FROM books
  JOIN users ON books.owner_id = users.id
  JOIN genre ON genre.id = books.genre
  WHERE books.id =$1`
    , [req.params.id]
    );
  
    res.json(data.rows[0]);
  } catch(e) {
    res.json(e);
  }
});

app.put('/books/:id', async(req, res) => {
  try {
    const data = await client.query(`
    UPDATE books
    SET did_read= TRUE
    WHERE id=$1
    RETURNING *`, [req.params.id]);
    res.json(data);
  } catch(e) {
    res.json(e);
  }
});


app.post('/books/', async(req, res) => {
  try {

    const data = await client.query(`
    INSERT INTO  books (book_title, did_read, scale, discription, genre, owner_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [req.body.book_title, req.body.did_read, req.body.scale, req.body.discription, req.body.genre, req.body.owner_id]
    );
    res.json(data);
  } catch(e) {
    res.json(e);
  }
});




app.delete('/books/:id', async(req, res) => {
  try {
    const data = await client.query(`
    DELETE   
    FROM books
    WHERE books.id =$1`, [req.params.id]);
    res.json(data);
  } catch(e) {
    res.json(e);
  }
});


app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;
