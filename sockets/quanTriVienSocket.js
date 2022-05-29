//const { addSocketId, sendEvent, deleteSocketId } = require('../utils/socket')
class quanTriVienSocket {
    xetDuyetTin(io) {
        io.on('connection', (socket) => {
            console.log(socket.id);
            socket.on('duyet-tin-tuyen-dung', (data) => {
                socket.broadcast.emit("res-duyet-tin-tuyen-dung", data)
            });
        });
    }
}

module.exports = new quanTriVienSocket;