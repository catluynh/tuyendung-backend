const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Enum = require('../utils/enum');
const { default: validator } = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const TaiKhoan = new Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: [true, 'Email đã tồn tại'],
        required: 'Email không được để trống',
        validate: [validator.isEmail, 'Email không hợp lệ']
    },
    tenDangNhap: {
        type: String,
        unique: [true, 'Tài khoản đã tồn tại'],
        minlength: [6, 'Tài khoản phải có ít nhất 6 kí tự'],
        required: [true, 'Tài khoản không được để trống']
    },
    matKhau: {
        type: String,
        required: [true, 'Mật khẩu không được để trống'],
        minlength: [8, 'Mật khẩu phải có ít nhất 8 kí tự'],
        select: false
    },
    xacNhanMatKhau: {
        type: String,
        validate: {
            validator: function (el) {
                return el === this.matKhau
            },
            message: 'Mật khẩu không trùng khớp'
        }
    },
    trangThai: {
        type: Boolean,
        default: true
    },
    xacThucTaiKhoan: {
        type: Boolean,
        default: false
    },
    loaiTaiKhoan: {
        type: String,
        enum: Enum.LOAI_TAI_KHOAN
    },
    ngayCapNhat: Date,
    ngayTao: {
        type: Date,
        default: Date.now()
    },
    ngayDoiMatKhau: Date,

    yeuCauKichHoat: {
        maKichHoat: String,
        thoiGianMaKichHoat: Date,
    }
})

TaiKhoan.pre('save', async function (next) {
    // Chạy khi mật khẩu cập nhật 
    if (!this.isModified('matKhau')) return next();
    this.matKhau = await bcrypt.hash(this.matKhau, 12);
    this.xacNhanMatKhau = undefined;
    next();
})

TaiKhoan.methods.randomToken = function () {
    const chuoiNgauNhien = crypto.randomBytes(32).toString('hex');
    this.yeuCauKichHoat.maKichHoat = crypto.createHash('sha256').update(chuoiNgauNhien).digest('hex');
    this.yeuCauKichHoat.thoiGianMaKichHoat = Date.now() + 10 * 60 * 1000; //10 phút 
    return chuoiNgauNhien;
}

TaiKhoan.methods.kiemTraMatKhau = async function (matKhauHienTai, matKhau) {
    return await bcrypt.compare(matKhauHienTai, matKhau);
}



module.exports = mongoose.model('taiKhoan', TaiKhoan)