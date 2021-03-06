const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Enum = require('../utils/enum');

const DonUngTuyen = new Schema({
    trangThai: {
        type: String,
        enum: Enum.TRANG_THAI_DON
    },
    ngayUngTuyen: {
        type: Date,
        default: Date.now()
    },
    ungTuyenVien: {
        type: Schema.Types.ObjectId,
        ref: 'ungTuyenVien'
    },
    tinTuyenDung: {
        type: Schema.Types.ObjectId,
        ref: 'tinTuyenDung'
    },
    guiEmail: {
        type: Boolean,
        default: false
    },
    ngayCapNhat: Date,
    thongTinLienHe: {
        ten: String,
        sdt: String,
        email: String,
        loiGioiThieu: String
    },
    tiemNang: {
        type: Boolean,
        default: false
    },
    phuongThuc: {
        type: Boolean
    },
    cv: String
})

DonUngTuyen.pre(/^find/, function (next) {
    this.populate('ungTuyenVien')
        .populate('tinTuyenDung')
    next()
})

module.exports = mongoose.model('donUngTuyen', DonUngTuyen)