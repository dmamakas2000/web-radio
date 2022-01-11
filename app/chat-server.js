// const io = require('socket.io')(9898)

const users = {}

const io = require("socket.io")(9898, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

// Each time a new user connects in
io.on('connection', socket => {
  socket.on('new-user', name => {
    // A new user was connected.
    users[socket.id] = name // Add the user to the list
    socket.broadcast.emit('user-connected', name) // Broadcast his id into the other users
  })
  socket.on('send-chat-message', message => {
    // User sent a message
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    // A user was disconnected
    socket.broadcast.emit('user-disconnected', users[socket.id]) // Broadcast into the other users
    delete users[socket.id] // Remove the users from the list
  })
})