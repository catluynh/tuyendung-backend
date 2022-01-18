const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TinNhan = new Schema({
    idNguoiGui: String,
    idNguoiNhan: String,
    noiDung: {
        type: String
    },
    ngayGui: {
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model('tinNhan', TinNhan)