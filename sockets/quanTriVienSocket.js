//const { addSocketId, sendEvent, deleteSocketId } = require('../utils/socket')
class quanTriVienSocket {
    xetDuyetTin(io) {
        io.on('connection', (socket) => {
            socket.on('xet-duyet-tin', (data) => {
                console.log(data)
            })
            socket.emit('welcome', {
                message: 'Connected !!!!'
            });
        });
    }
}

module.exports = new quanTriVienSocket;