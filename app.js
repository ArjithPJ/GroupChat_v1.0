const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');

//const errorController =require('./controllers/error');
const sequelize = require('./util/database');

const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require("compression");
const morgan = require("morgan");

const app = express();
app.use(cors());


app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}),);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));