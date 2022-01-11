const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { default: validator } = require('validator');

const NhaTuyenDung = new Schema({
    avatar: {
        type: String,
        default: 'ntd-avatar-default.png',
    },
    tenCongty: {
        type: String,
        required: 'Tên công ty không được để trống'
    },
    namThanhLap: {
        type: Date,
        default: Date.now()
    },
    quyMo: {
        type: String,
    },
    moTa: {
        type: String,
        minlength: [50, 'Tối thiểu 50 kí tự'],
        // required: [true, 'Mô tả không được để trống']
    },
    website: {
        type: String,
        //minlength: [50, 'Tối thiểu 50 kí tự'],
        required: 'website không được để trống'
    },
    sdt: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: [true, 'Email đã tồn tại'],
        required: 'Email không được để trống',
        validate: [validator.isEmail, 'Email không hợp lệ']
    },
    taiKhoan: {
        type: Schema.Types.ObjectId,
        ref: 'taiKhoan'
    }

})
module.exports = mongoose.model('nhaTuyenDung', NhaTuyenDung)