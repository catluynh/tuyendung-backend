const express = require("express");
const app = express();
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })
const mongoose = require('mongoose');
const port = process.env.PORT;
const route = require("./routes");
const http = require('http');
const upload = require('express-fileupload');
const socketIo = require('socket.io');
const initSockets = require('./sockets/index');
const jwt = require('jsonwebtoken');
const server = http.createServer(app);
const io = socketIo(server);
const paypal = require('paypal-rest-sdk');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Cho phép cors với toàn bộ route
app.use(cors());

//config paypal
paypal.configure({
    'mode': process.env.MODE, //sandbox or live
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
  });

//Kết nối database
mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
}).then(() => console.log('DB connection successful'));


app.use(upload());
route(app);

//config socket
io.use(async (socket, next) => {
    try {
        let token;
        // Kiểm tra token và lấy token
        if (socket.handshake.headers.authorization && socket.handshake.headers.authorization.startsWith('Bearer')) {
            token = socket.handshake.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new AppError('Vui lòng đăng nhập 😫', 401));
        }

        // Xác minh token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        //Lưu vào socket
        socket.taiKhoanId = decoded.id;
        next();
    } catch (err) {
        next(err);
    }
});

initSockets(io);

//Lắng nghe port
server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

// //Từ chối xử lý (lỗi kết nối)
// process.on('unhandledRejection', (err) => {
//     console.log(err.name, err.message);
//     console.log('Unhandled Rejection 😮');
//     server.close(() => {
//       process.exit(1);
//     });
//   });