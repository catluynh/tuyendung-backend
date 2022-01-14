//const { addSocketId, sendEvent, deleteSocketId } = require('../utils/socket')
class authSocket {
    demo(io) {
        let listUsers = {};
        io.on('connection', (socket) => {
            console.log(socket.taiKhoanId)
            socket.emit('welcome', {
                message: 'Connected !!!!'
            });
        });
    }
}

module.exports = new authSocket;