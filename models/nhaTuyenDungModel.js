const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { default: validator } = require('validator');
const slugify = require('slugify');

const NhaTuyenDung = new Schema({
    avatar: {
        type: String,
        default: 'ntd-avatar-default.png',
    },
    tenCongty: {
        type: String
    },
    namThanhLap: {
        type: Number
    },
    quyMo: {
        type: String,
    },
    moTa: {
        type: String
    },
    website: {
        type: String
    },
    sdt: {
        type: String
    },
    email: {
        type: String
    },
    taiKhoan: {
        type: Schema.Types.ObjectId,
        ref: 'taiKhoan'
    },
    slug: String
})

NhaTuyenDung.pre('save', function (next) {
    this.slug = slugify(this.tenCongty, { lower: true })
    next()
})

module.exports = mongoose.model('nhaTuyenDung', NhaTuyenDung)