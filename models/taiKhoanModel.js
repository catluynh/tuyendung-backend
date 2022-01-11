const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
        minlength: [8, 'Tài khoản phải có ít nhất 8 kí tự'],
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
            //Chỉ khi tạo
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
    loaiTaiKhoan: {
        type: String,
        enum: ['ứng tuyển viên', 'nhà tuyển dụng', 'quản trị viên']
    },
    ngayTao: {
        type: Date,
        default: Date.now()
    },
    matKhauThayDoi: Date,
    matKhauRandomToken: String,
    matKhauHetHan: Date,
})

TaiKhoan.pre('save', async function (next) {
    // Chạy khi mật khẩu cập nhật 
    if (!this.isModified('matKhau')) return next()
    this.matKhau = await bcrypt.hash(this.matKhau, 12)
    this.xacNhanMatKhau = undefined;
    next();
})

TaiKhoan.methods.randomToken = function () {
    const randomToken = crypto.randomBytes(32).toString('hex');
    this.matKhauRandomToken = crypto.createHash('sha256').update(randomToken).digest('hex');
    this.matKhauHetHan = Date.now() + 10 * 60 * 1000; //10 phút 
    return randomToken;
}

TaiKhoan.methods.kiemTraMatKhau = async function (matKhauHienTai, matKhau) {
    return await bcrypt.compare(matKhauHienTai, matKhau);
}



module.exports = mongoose.model('taiKhoan', TaiKhoan)