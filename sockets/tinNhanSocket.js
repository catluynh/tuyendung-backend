const { addSocketId, sendEvent, deleteSocketId } = require('../utils/socket')
class tinNhanSocket {
    gui(io) {
        let listUsers = {};
        io.on('connection', (socket) => {
            let idGui = socket.taiKhoanId;
            listUsers = addSocketId(listUsers, idGui, socket.id);
            socket.on('gui-tin-nhan', (data) => {
                let nguoiGui = {
                    id: idGui
                };
                if (listUsers[data.idNhan]) {
                    sendEvent(listUsers, data.idNhan, io, 'nhan-tin-nhan', nguoiGui);
                };
            });
            //xóa id socket mỗi khi socket disconnect
            socket.on('disconnect', () => {
                listUsers = deleteSocketId(listUsers, idGui, socket);
            });
        });
    }
}

module.exports = new tinNhanSocket;