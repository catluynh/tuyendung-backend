const authSocket = require('./authSocket');
const tinNhanSocket = require('./tinNhanSocket');

function initSockets(io) {

    authSocket.demo(io);
    tinNhanSocket.gui(io);

}

module.exports = initSockets;