const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { default: validator } = require('validator');

const NhaTuyenDung = new Schema({
    avatar: {
        type: String,
        default: 'ntd-avatar-default.png',
    },
    tenCongty: {
        type: String
    },
    namThanhLap: {
        type: Date,
        default: Date.now()
    },
    quyMo: {
        type: String,
    },
    moTa: {
        type: String
    },
    website: {
        type: String
    },
    sdt: {
        type: String
    },
    email: {
        type: String
    },
    taiKhoan: {
        type: Schema.Types.ObjectId,
        ref: 'taiKhoan'
    }

})
module.exports = mongoose.model('nhaTuyenDung', NhaTuyenDung)