const client = require('../lib/client');
// import our seed data:
const animals = require('./animals.js');
const usersData = require('./users.js');

run();

async function run() {

  try {
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
                    INSERT INTO animals (year, BookTitle, didRead, user_id , scale)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [animal.year, animal.BookTitle, animal.didRead, user.id, animal.scale]);
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
