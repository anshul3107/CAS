const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const serverConfig = require('./serverConfig');
const apiRoutes = require('./Routes/api-routes');

const server = express();

server.use(bodyParser.json());
server.use('/api', apiRoutes);

mongoose
    .connect(serverConfig.dbURL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() =>
        server.listen(
            serverConfig.serverPort,
            console.log('Server Running! Listening on port:', serverConfig.serverPort)
        )
    )
    .catch((err) => console.log('Error connecting to the DB:', err));
