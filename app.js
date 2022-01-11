const express = require("express");
const app = express();
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })
const mongoose = require('mongoose');
const port = process.env.PORT;
const route = require("./routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Cho phép cors với toàn bộ route
app.use(cors());

//Kết nối database
mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
}).then(() => console.log('DB connection successful'));

route(app);

//Lắng nghe port
app.listen(port, () => {
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