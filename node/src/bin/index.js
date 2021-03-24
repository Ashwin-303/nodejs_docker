import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import toobusy from 'node-toobusy'
import config from '../config';
import fs from 'fs';
import Database from '../database';
var rfs = require('rotating-file-stream');
var path = require('path');
const app = express();
var database = new Database();
database.status()
// Express Status Monitor for monitoring server status
app.use(require('express-status-monitor')({
    title: 'Server Status',
    path: '/status',
    spans: [{
        interval: 1,
        retention: 60
    }, {
        interval: 5,
        retention: 60
    }, {
        interval: 15,
        retention: 60
    }],
    chartVisibility: {
        cpu: true,
        mem: true,
        load: true,
        responseTime: true,
        rps: true,
        statusCodes: true
    },
    healthChecks: [{
        protocol: 'http',
        host: 'localhost',
        path: '/',
        port: config.port
    }]
}));
// compress all responses
app.use(compression());
// middleware which blocks requests when server is too busy
app.use(function (req, res, next) {
    if (toobusy()) {
        res.status(503);
        res.send("Server is busy right now, sorry.");
    } else {
        next();
    }
});

// Linking log folder and ensure directory exists
let logDirectory = path.join(__dirname, '../log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
fs.appendFile(`${logDirectory}/ServerData.log`, '', function (err) {
    if (err) throw err;
});
// Generating date and time for logger
morgan.token('datetime', function displayTime() {
    return new Date().toString();
});
// Create a rotating write stream
var accessLogStream = rfs.createStream('Server.log', {
    size: "10M", // rotate every 10 MegaBytes written
    interval: '1d', // rotate daily
    compress: "gzip", // compress rotated files
    path: logDirectory
});
// app.use(
//   '/api/v1/',
//   verifyToken.unless({
//     path: CONSTANT.JWT_ALLOWED_URLS,
//   }),
//   router
// );

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// enable cors
app.use(cors());
app.options('*', cors());
// defining mode of logging
app.use(morgan('dev'));
app.use(morgan(':remote-addr :remote-user :datetime :req[header] :method :url HTTP/:http-version :status :res[content-length] :res[header] :response-time[digits] :referrer :user-agent', {
    stream: accessLogStream
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
export default app;