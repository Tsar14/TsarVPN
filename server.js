const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware для обработки JSON-тела запроса
app.use(bodyParser.json());

// Маршрут для обработки вебхуков от PayMaster
app.post('/paymaster-webhook', (req, res) => {
    const webhookData = req.body;

    // Логируем данные вебхука
    console.log('Получен вебхук от PayMaster:', webhookData);

    // Проверяем статус платежа
    if (webhookData.status === 'success') {
        console.log('Платеж успешно завершен:', webhookData);
        // Здесь можно обновить статус платежа в вашей базе данных
        // Например, отметить подписку как активную
    } else if (webhookData.status === 'failed') {
        console.log('Платеж не удался:', webhookData);
        // Обработка неудачного платежа
    } else {
        console.log('Неизвестный статус платежа:', webhookData);
    }

    // Отправляем ответ PayMaster (обязательно)
    res.status(200).send('Webhook received');
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
