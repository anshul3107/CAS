const express = require('express');
const bodyParser = require('body-parser');

const serverConfig = require('./serverConfig');
const sampleRoutes = require('./Routes/sample-routes');

const server = express();

server.use(bodyParser.json());

server.use('/hello', sampleRoutes);

server.listen(serverConfig.serverPort, () =>
    console.log('Service Application started. Listening on port:', serverConfig.serverPort)
);
