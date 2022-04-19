const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LinhVuc = new Schema({
    tenLinhVuc: String,
    hinhAnh:  {
        type: String,
        default: 'linhvuc-default.png',
    }
})

module.exports = mongoose.model('linhVuc', LinhVuc)