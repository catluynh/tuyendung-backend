const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { default: validator } = require('validator');
const bcrypt = require('bcrypt');

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
    // nhaTuyenDung: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'nhaTuyenDung'
    // }
})

TaiKhoan.pre('save', async function (next) {
    // Chạy khi mật khẩu cập nhật 
    if (!this.isModified('matKhau')) return next()
    this.matKhau = await bcrypt.hash(this.matKhau, 12)
    this.xacNhanMatKhau = undefined;
    next();
})

TaiKhoan.methods.kiemTraMatKhau = async function (mk_1, mk_2) {
    return await bcrypt.compare(mk_1, mk_2);
}

module.exports = mongoose.model('taiKhoan', TaiKhoan)