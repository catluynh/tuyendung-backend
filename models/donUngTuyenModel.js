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
    }
})

DonUngTuyen.pre(/^find/, function (next) {
    this.populate(['ungTuyenVien', 'tinTuyenDung'])
    next()
})

module.exports = mongoose.model('donUngTuyen', DonUngTuyen)