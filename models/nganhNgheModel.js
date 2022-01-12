const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NganhNghe = new Schema({
    tenNganhNghe: String,
    linhVuc: {
        type: Schema.Types.ObjectId,
        ref: 'linhVuc'
    },
})

NganhNghe.pre(/^find/, function (next) {
    this.populate('linhVuc')
    next()
})

module.exports = mongoose.model('nganhNghe', NganhNghe)