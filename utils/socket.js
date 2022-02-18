let addSocketId = (clients, userId, socketId) => {
    if (clients[userId]) {
        clients[userId].push(socketId);
    } else {
        clients[userId] = [socketId];
    }
    return clients;
}

let sendEvent = (clients, userId, io, eventName, data) => {
    clients[userId].forEach(socketId => {
        return io.to(socketId).emit(eventName, data);
    });
}

let deleteSocketId = (clients, userId, socket) => {
    clients[userId] = clients[userId].filter((socketId) => {
        return socketId !== socket.id;
    })
    if (!clients[userId].length) {
        delete clients[userId];
    }
    return clients;
}

module.exports = {
    addSocketId,
    sendEvent,
    deleteSocketId
}