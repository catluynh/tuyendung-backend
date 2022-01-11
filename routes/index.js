const authRouter = require('./authRoutes');
const nhaTuyenDungRouter = require('./nhaTuyenDungRoutes');
const ungTuyenVienRouter = require('./ungTuyenVienRoutes');

function route(app) {
    app.use('/auth', authRouter);
    app.use('/nhaTuyenDungs', nhaTuyenDungRouter);
    app.use('/ungTuyenViens', ungTuyenVienRouter)
}

module.exports = route;
