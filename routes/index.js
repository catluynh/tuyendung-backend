const authRouter = require('./authRoutes');
const nhaTuyenDungRouter = require('./nhaTuyenDungRoutes');
const ungTuyenVienRouter = require('./ungTuyenVienRoutes');
const tinTuyenDungRouter = require('./tinTuyenDungRoutes');
const linhVucRouter = require('./linhVucRoutes');
const nganhNgheRouter = require('./nganhNgheRoutes');
const donUngTuyenRouter = require('./donUngTuyenRoutes');
const danhGiaRouter = require('./danhGiaRoutes');
const tinTucRouter = require('./tinTucRoutes');
const tinNhanRouter = require('./tinNhanRoutes');
const quanTriVienRouter = require('./quanTriVienRoutes');
const thongKeRouter = require('./thongKeRoutes');

function route(app) {
    app.use('/auth', authRouter);
    app.use('/nhaTuyenDungs', nhaTuyenDungRouter);
    app.use('/ungTuyenViens', ungTuyenVienRouter);
    app.use('/tinTuyenDungs', tinTuyenDungRouter);
    app.use('/linhVucs', linhVucRouter);
    app.use('/nganhNghes', nganhNgheRouter);
    app.use('/donUngTuyens', donUngTuyenRouter);
    app.use('/danhGias', danhGiaRouter);
    app.use('/tinTucs', tinTucRouter);
    app.use('/tinNhans', tinNhanRouter);
    app.use('/quanTriViens', quanTriVienRouter);
    app.use('/thongKes', thongKeRouter);
}

module.exports = route;
