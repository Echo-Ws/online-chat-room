const app = require("express")();
// const bodyParser = require('body-parser')
const server = app.listen(8000, () => {
    console.log("Server listening on port 8000");
});
const io = require('socket.io')(server);
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', require('./router.js'));

let numUsers = 0;

io.on('connection', function (socket) {
    socket.on('add user', (username) => {
        if (socket.hasOwnProperty('username')) return;
        // console.log(username + ' connected ');
        // store the username in the socket session for this client
        socket.username = username;
        numUsers+=1;

        socket.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });


    socket.on('send message', function (msg) {
        io.emit('new message', {
            'message':msg,
            'username': socket.username,
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
        // console.log(socket.username+' left')
        if (socket.username && numUsers) {
            numUsers -=1 ;
            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});




