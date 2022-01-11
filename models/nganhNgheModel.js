const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NganhNghe = new Schema({
    tenNganhNghe: String,
    linhVuc: {
        type: Schema.Types.ObjectId,
        ref: 'linhVuc'
    },
})

module.exports = mongoose.model('nganhNghe', NganhNghe)