
const { Client } = require('pg');

async function checkDb() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'skillvia_db_2',
    password: 'admin123',
    port: 5432,
  });

  try {
    await client.connect();
    console.log('Connected to DB');
    
    const res = await client.query('SELECT id, "statut", "score", "offreId", "candidatId" FROM candidatures ORDER BY id DESC LIMIT 20');
    console.log('Recent Candidatures:');
    console.table(res.rows);

    const check80 = await client.query('SELECT c.id, c."offreId", o."entrepriseId" FROM candidatures c JOIN "offre-emploi" o ON c."offreId" = o.id WHERE c.id = 80');
    console.log('Check Candidature 80:');
    console.table(check80.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkDb();
