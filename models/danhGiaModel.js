const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Enum = require('../utils/enum');

const DanhGia = new Schema({
    noiDung: {
        type: String
    },
    xepLoai: {
        type: String,
        enum: Enum.XEP_LOAI
    },
    ngay: {
        type: Date,
        default: Date.now()
    },
    danhGiaBoi: {
        type: Schema.Types.ObjectId,
        ref: 'ungTuyenVien'
    },
    tinTuyenDung: {
        type: Schema.Types.ObjectId,
        ref: 'tinTuyenDung'
    }
})

DanhGia.pre(/^find/, function (next) {
    this.populate({ path: 'danhGiaBoi', select: 'taiKhoan'})
    //.populate({ path: 'tinTuyenDung', select: 'nganhNghe'})
    next()
})

module.exports = mongoose.model('danhGia', DanhGia)