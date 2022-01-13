const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Enum = require('../utils/enum');

const TinTuc = new Schema({
    tieuDe: {
        type: String
    },
    noiDung: {
        type: String
    },
    hinhAnh: {
        type: String
    },
    ngayTao: {
        type: Date,
        default: Date.now()
    },
    quanTriVien: {
        type: Schema.Types.ObjectId,
        ref: 'quanTriVien'
    }
})

module.exports = mongoose.model('tinTuc', TinTuc)