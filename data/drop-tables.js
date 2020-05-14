const client = require('../lib/client');

run();

async function run() {
  await client.connect();

  try {
    
    
    await client.query(`
            DROP TABLE IF EXISTS users CASCADE;
            DROP TABLE IF EXISTS genre CASCADE;
            DROP TABLE IF EXISTS books;
        `);

    console.log('drop tables complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
