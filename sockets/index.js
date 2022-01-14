const authSocket = require('./authSocket');

function initSockets(io) {

    authSocket.demo(io);

}

module.exports = initSockets;