const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
    user: 'your_db_user',
    host: 'localhost',
    database: 'your_db_name',
    password: 'your_db_password',
    port: 5432,
});

// Обработка оплаты
app.post('/api/payment', async (req, res) => {
    const { username, email, tariff, accessKey } = req.body;

    try {
        // Сохраняем данные в базу данных
        const query = `
            INSERT INTO subscriptions (username, email, tariff, access_key)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [username, email, tariff, accessKey];
        const result = await pool.query(query, values);

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
