import app from '../bin';
import config from '../config';
import http from 'http';
import fs from 'fs';
let server;

http.createServer(app).listen(config.port, () => {
    console.log(`Host Name: ${config.HOSTNAME}`);
    console.log(`Listening to port ${config.port}`);
}, config.HOSTNAME);
const exitHandler = () => {
    if (server) {
        server.close(() => {
            consola.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};
const unexpectedErrorHandler = (error) => {
    console.error(error);
    exitHandler();
};
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
    consola.info('SIGTERM received');
    if (server) {
        server.close();
    }
});