const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ViecLamQuanTam = new Schema({
    tinTuyenDung: {
        type: Schema.Types.ObjectId,
        ref: 'tinTuyenDung'
    },
    ungTuyenVien: {
        type: Schema.Types.ObjectId,
        ref: 'ungTuyenVien'
    }
})

ViecLamQuanTam.pre(/^find/, function (next) {
    this.populate('tinTuyenDung')
    next()
})

module.exports = mongoose.model('viecLamQuanTam', ViecLamQuanTam)