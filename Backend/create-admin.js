/**
 * Plain Node.js script (no TypeScript, no ts-node needed).
 * Run: node create-admin.js
 */
const bcrypt = require('bcrypt');
const { Client } = require('pg');

const ADMIN_EMAIL    = 'skillvia.recrutement@gmail.com';
const ADMIN_PASSWORD = 'Admin@Skillvia2026!';

async function main() {
  const client = new Client({
    host:     'localhost',
    port:     5432,
    user:     'postgres',
    password: '123456',
    database: 'skillvia_db_2',
  });

  await client.connect();
  console.log('Connected to skillvia_db_2');

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  console.log('Password hashed.');

  // Upsert: insert or update if email already exists
  const result = await client.query(
    `INSERT INTO users (nom, prenom, email, password, role, "isEmailVerified")
     VALUES ($1, $2, $3, $4, 'Admin', true)
     ON CONFLICT (email)
     DO UPDATE SET
       password        = EXCLUDED.password,
       role            = 'Admin',
       nom             = EXCLUDED.nom,
       prenom          = EXCLUDED.prenom,
       "isEmailVerified" = true
     RETURNING id, email, role`,
    ['Skillvia', 'Admin', ADMIN_EMAIL, hash]
  );

  const row = result.rows[0];
  console.log(`\n✅ Admin account ready:`);
  console.log(`   ID    : ${row.id}`);
  console.log(`   Email : ${row.email}`);
  console.log(`   Role  : ${row.role}`);
  console.log(`\n   Login with:`);
  console.log(`   Email   : ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);

  await client.end();
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
