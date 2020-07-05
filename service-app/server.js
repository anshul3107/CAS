const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const serverConfig = require('./serverConfig');
const publicRoutes = require('./Routes/public-routes');
const apiRoutes = require('./Routes/api-routes');

const server = express();

server.use(bodyParser.json());

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, api_key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});
server.use('/public/api', publicRoutes);

// server.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'server-origin-after-deployment');
//     next();
// });
server.use('/api', apiRoutes);

server.use((err, req, res, next) => {
    if (res.headerSent) {
        return next(err);
    }
    res.status(err.code || 500);
    res.json({
        code: err.code || 500,
        message: err.message || 'Internal Server Error occoured'
    });
});

mongoose
    .connect(serverConfig.dbURL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() =>
        server.listen(
            serverConfig.serverPort,
            console.log('Server Running! Listening on port:', serverConfig.serverPort)
        )
    )
    .catch((err) => console.log('Error connecting to the DB:', err));
