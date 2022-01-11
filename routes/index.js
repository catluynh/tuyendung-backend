const authRouter = require('./authRoutes');
const nhaTuyenDungRouter = require('./nhaTuyenDungRoutes');
const ungTuyenVienRouter = require('./ungTuyenVienRoutes');
const tinDuyenDungRouter = require('./tinDuyenDungRoutes');
const linhVucRouter = require('./linhVucRoutes');
const nganhNgheRouter = require('./nganhNgheRoutes');

function route(app) {
    app.use('/auth', authRouter);
    app.use('/nhaTuyenDungs', nhaTuyenDungRouter);
    app.use('/ungTuyenViens', ungTuyenVienRouter);
    app.use('/tinTuyenDungs', tinDuyenDungRouter);
    app.use('/linhVucs', linhVucRouter);
    app.use('/nganhNghes', nganhNgheRouter);
}

module.exports = route;
