const express = require('express');
const app = express();
const itemsRoutes = require('routes-items');

app.use(express.json()); // for parsing application/json
app.use('/items', itemsRoutes);

// 404 handler
app.use((req, res, next) => {
    return res.status(404).json({ error: "Not Found" });
});

// Generic error handler
app.use((err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message;

    return res.status(status).json({ error: { message, status } });
});

module.exports = app;
