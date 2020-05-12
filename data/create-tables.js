const client = require('../lib/client');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                ); 
                CREATE TABLE genre (
                  id SERIAL PRIMARY KEY,
                  book_genre VARCHAR(512)  NOT NULL
                );          
                CREATE TABLE books (
                    id SERIAL PRIMARY KEY NOT NULL,
                    book_title VARCHAR(512) NOT NULL,
                    did_read BOOLEAN NOT NULL,
                    scale INTEGER NOT NULL,
                    discription VARCHAR(512),
                    genre INTEGER NOT NULL REFERENCES genre(id),
                    owner_id INTEGER NOT NULL REFERENCES users(id)
                    
            );
        `);

    console.log('create tables complete');
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
