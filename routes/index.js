const authRouter = require('./authRoutes');
const nhaTuyenDungRouter = require('./nhaTuyenDungRoutes');

function route(app) {
    app.use('/auth', authRouter);
    app.use('/nhaTuyenDungs', nhaTuyenDungRouter)
}

module.exports = route;
