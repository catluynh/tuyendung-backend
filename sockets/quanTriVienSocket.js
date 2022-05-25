//const { addSocketId, sendEvent, deleteSocketId } = require('../utils/socket')
class quanTriVienSocket {
    xetDuyetTin(io) {
        io.on('connection', (socket) => {
            socket.on('dung-tuyen', (data) => {

            });
        });
    }
}

module.exports = new quanTriVienSocket;