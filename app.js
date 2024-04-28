const express = require("express");
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http'); // Import http module

const sequelize = require('./util/database');
const initializeWebSocket = require('./controllers/chats').initializeWebSocket; // Import WebSocket initialization function
const Users = require('./models/users');
const Chats = require('./models/chats');
const Groups = require('./models/groups');
const GroupMembers = require('./models/groupMembers');

const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require("compression");
const morgan = require("morgan");

const app = express();
const dotenv = require('dotenv');
dotenv.config();

const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const chatsRoutes = require('./routes/chats');
const adminRoutes = require('./routes/admin');
const ForgotPasswordRequests = require("./models/forgotPasswordRequests");
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(signupRoutes);
app.use(loginRoutes);
app.use(chatsRoutes);
app.use(adminRoutes);

// Create an HTTP server instance
const server = http.createServer(app);

// Initialize WebSocket with the server instance
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Pass the WebSocket instance to your function for further initialization
initializeWebSocket(io);

app.locals.socketio = io;


// Listen on port 3000
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

sequelize
    .sync()
    .then(result => {
        console.log('Database connected.');
    })
    .catch(err => {
        console.log(err);
    });

module.exports = app;
