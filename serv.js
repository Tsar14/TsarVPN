const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Генерация ключа для VPN
function generateAccessKey() {
    return 'OUTLINE-' + Math.random().toString(36).substring(2, 15).toUpperCase();
}

// Добавление пользователя в Xray UI
async function addUserToXrayUI(email, accessKey) {
    try {
        const response = await axios.post('http://your-xray-ui-domain/api/user', {
            email: email,
            uuid: accessKey, // Используем accessKey как UUID
            limit: 10737418240, // 10 ГБ
            enable: true,
        }, {
            headers: {
                'Authorization': 'Bearer YOUR_API_KEY',
                'Content-Type': 'application/json',
            },
        });

        console.log('Пользователь добавлен в Xray UI:', response.data);
    } catch (error) {
        console.error('Ошибка при добавлении пользователя в Xray UI:', error);
    }
}

// Обработка оплаты
app.post('/api/payment', async (req, res) => {
    const { telegram_id, email, tariff } = req.body;

    try {
        // Генерация ключа
        const accessKey = generateAccessKey();

        // Добавляем пользователя в Xray UI
        await addUserToXrayUI(email, accessKey);

        // Возвращаем ключ пользователю
        res.status(200).json({ success: true, accessKey: accessKey });
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Запуск сервера
app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
