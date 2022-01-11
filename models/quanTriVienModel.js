const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuanTriVien = new Schema({
    avatar: {
        type: String,
        default: 'ntd-avatar-default.png',
    },
    ten: {
        type: String
    },
    sdt: {
        type: String
    },
    taiKhoan: {
        type: Schema.Types.ObjectId,
        ref: 'taiKhoan'
    }
})

module.exports = mongoose.model('quanTriVien', QuanTriVien)