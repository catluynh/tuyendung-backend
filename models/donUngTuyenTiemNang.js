const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DonUngTuyenTiemNang = new Schema({
    nhaTuyenDung: {
        type: Schema.Types.ObjectId,
        ref: 'nhaTuyenDung'
    },
    donUngTuyen: {
        type: Schema.Types.ObjectId,
        ref: 'donUngTuyen'
    }
})

DonUngTuyenTiemNang.pre(/^find/, function (next) {
    this.populate('danhGiaBoi').populate('donUngTuyen')
    next()
})

module.exports = mongoose.model('donUngTuyenTiemNang', DonUngTuyenTiemNang)