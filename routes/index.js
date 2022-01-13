const authRouter = require('./authRoutes');
const nhaTuyenDungRouter = require('./nhaTuyenDungRoutes');
const ungTuyenVienRouter = require('./ungTuyenVienRoutes');
const tinDuyenDungRouter = require('./tinDuyenDungRoutes');
const linhVucRouter = require('./linhVucRoutes');
const nganhNgheRouter = require('./nganhNgheRoutes');
const donUngTuyenRouter = require('./donUngTuyenRoutes');
const danhGiaRouter = require('./danhGiaRoutes');
const tinTucRouter = require('./tinTucRoutes');

function route(app) {
    app.use('/auth', authRouter);
    app.use('/nhaTuyenDungs', nhaTuyenDungRouter);
    app.use('/ungTuyenViens', ungTuyenVienRouter);
    app.use('/tinTuyenDungs', tinDuyenDungRouter);
    app.use('/linhVucs', linhVucRouter);
    app.use('/nganhNghes', nganhNgheRouter);
    app.use('/donUngTuyens', donUngTuyenRouter);
    app.use('/danhGias', danhGiaRouter);
    app.use('/tinTucs', tinTucRouter);
}

module.exports = route;
