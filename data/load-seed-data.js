const client = require('../lib/client');
// import our seed data:
const animals = require('./books.js');
const genreData = require('./genre.js');
const usersData = require('./users.js');

run();

async function run() {

  try {

    await Promise.all(
      genreData.map(genre => {
        return client.query(`
                    INSERT INTO genre (book_genre)
                    VALUES ($1);
                `,
        [genre.book_genre]);
      }));
    
    
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];
    
 

    await Promise.all(
      animals.map(animal => {
        return client.query(`
                    INSERT INTO books (book_title, did_read,  scale, discription, genre_id, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [animal.book_title, animal.did_read, animal.scale, animal.discription, animal.book_genre, user.id]);
      })
    );
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
