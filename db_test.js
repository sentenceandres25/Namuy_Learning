const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'namuy_learning',
    password: 'tu_contraseña',
    port: 5432,
});

pool.query('SELECT * FROM usuarios', (err, res) => {
    if (err) {
        console.error('Error ejecutando la consulta:', err.stack);
    } else {
        console.log('Datos:', res.rows);
    }
    pool.end();
});
