const quanTriVienSocket = require('./quanTriVienSocket');

function initSockets(io) {

    quanTriVienSocket.xetDuyetTin(io);

}

module.exports = initSockets;