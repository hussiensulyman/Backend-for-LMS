const { Server } = require('socket.io');

let io;

const initNotifications = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

const sendNotification = (userId, message) => {
  if (io) {
    io.to(userId).emit('notification', message);
  }
};

module.exports = { initNotifications, sendNotification };