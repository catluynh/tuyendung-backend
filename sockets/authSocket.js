//const { addSocketId, sendEvent, deleteSocketId } = require('../utils/socket')
class authSocket {
    demo(io) {
        let listUsers = {};
        io.on('connection', (socket) => {
            socket.emit('welcome', {
                message: 'Connected !!!!'
            });
        });
    }
}

module.exports = new authSocket;