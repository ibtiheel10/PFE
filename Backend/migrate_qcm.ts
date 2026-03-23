import { createConnection } from 'typeorm';

async function migrate() {
    const conn = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'admin123',
        database: 'skillvia_db_2',
        entities: [],
        synchronize: false,
    });
    try {
        await conn.query('ALTER TABLE candidatures ADD COLUMN IF NOT EXISTS "qcmDisponible" boolean NOT NULL DEFAULT false');
        console.log('✅ Column qcmDisponible added (or already exists).');
    } catch (e: any) {
        console.error('Migration error:', e.message);
    }
    await conn.close();
}
migrate().catch(console.error);
