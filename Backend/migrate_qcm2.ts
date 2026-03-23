import { createConnection } from 'typeorm';

async function migrate() {
    const conn = await createConnection({
        type: 'postgres', host: 'localhost', port: 5432,
        username: 'postgres', password: 'admin123',
        database: 'skillvia_db_2', entities: [], synchronize: false,
    });
    await conn.query('ALTER TABLE offres_emploi ADD COLUMN IF NOT EXISTS "qcmPublie" boolean NOT NULL DEFAULT false');
    console.log('✅ qcmPublie column added.');
    await conn.close();
}
migrate().catch(console.error);
