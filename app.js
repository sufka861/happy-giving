const express = require('express');
const logger = require('morgan');
const app = express();
const mongoose = require('mongoose');
const deliveryRouter = require('./router/delivery');
require('dotenv').config();


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@woliday.vteeobu.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

mongoose.connection.on('connected', () => {
    console.log('connected to MongoDB');
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


app.use('/delivery', deliveryRouter);


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;