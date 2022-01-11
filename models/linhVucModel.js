const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LinhVuc = new Schema({
    tenLinhVuc: String,
})

module.exports = mongoose.model('linhVuc', LinhVuc)