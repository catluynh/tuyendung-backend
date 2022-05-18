const authRouter = require('./authRoutes');
const nhaTuyenDungRouter = require('./nhaTuyenDungRoutes');
const ungTuyenVienRouter = require('./ungTuyenVienRoutes');
const tinTuyenDungRouter = require('./tinTuyenDungRoutes');
const linhVucRouter = require('./linhVucRoutes');
const nganhNgheRouter = require('./nganhNgheRoutes');
const donUngTuyenRouter = require('./donUngTuyenRoutes');
const danhGiaRouter = require('./danhGiaRoutes');
const taiKhoanRouter = require('./taiKhoanRoutes');
const quanTriVienRouter = require('./quanTriVienRoutes');
const thongKeRouter = require('./thongKeRoutes');
const donUngTuyenTiemNangRouter = require('./donUngTuyenTiemNangRoutes');
const viecLamQuanTamRouter = require('./viecLamQuanTamRoutes');

function route(app) {
    app.use('/auth', authRouter);
    app.use('/taiKhoans', taiKhoanRouter);
    app.use('/nhaTuyenDungs', nhaTuyenDungRouter);
    app.use('/ungTuyenViens', ungTuyenVienRouter);
    app.use('/tinTuyenDungs', tinTuyenDungRouter);
    app.use('/linhVucs', linhVucRouter);
    app.use('/nganhNghes', nganhNgheRouter);
    app.use('/donUngTuyens', donUngTuyenRouter);
    app.use('/danhGias', danhGiaRouter);
    app.use('/quanTriViens', quanTriVienRouter);
    app.use('/thongKes', thongKeRouter);
    app.use('/donUngTuyenTiemNangs', donUngTuyenTiemNangRouter);
    app.use('/viecLamQuanTams', viecLamQuanTamRouter);
}

module.exports = route;
