const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');

//const errorController =require('./controllers/error');
const sequelize = require('./util/database');

const Users = require('./models/users');
const Chats = require('./models/chats');

const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require("compression");
const morgan = require("morgan");

const app = express();

const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const chatsRoutes = require('./routes/chats');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(cors());

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}),);

//app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(signupRoutes);
app.use(loginRoutes);
app.use(chatsRoutes);

sequelize
.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});