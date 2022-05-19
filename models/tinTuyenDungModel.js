const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Enum = require('../utils/enum');
const slugify = require('slugify');


const ViecLamDaLuu = new Schema({
    ungTuyenVien: {
        type: Schema.Types.ObjectId,
        ref: 'ungTuyenVien'
    }
})

const TinTuyenDung = new Schema({
    tieuDe: String,
    viTri: {
        type: String,
        enum: Enum.VI_TRI
    },
    soLuongTuyen: Number,
    loaiCongViec: {
        type: String,
        enum: Enum.LOAI_CONG_VIEC
    },
    ngayHetHan: Date,
    soNamKinhNghiem: {
        type: String,
        enum: Enum.SO_NAM_KINH_NGHIEM
    },
    gioiTinh: {
        type: String,
        default: 'Không phân biệt'
    },
    mucLuong: {
        type: String,
        default: 'Thỏa thuận'
    },
    bangCap: {
        type: String,
        enum: Enum.BANG_CAP
    },
    tuoiTu: {
        type: Number,
        min: [18, 'Phải từ 18 tuổi']
    },
    denTuoi: Number,
    nganhNghe: {
        type: Schema.Types.ObjectId,
        ref: 'nganhNghe'
    },
    phucLoi: String,
    hinhAnh: [{
        tenHinhAnh: {
            type: String,
        }
    }],
    diaDiem: {
        tinhThanhPho: String,
        quanHuyen: String
    },
    moTa: String,
    yeuCau: String,
    trangThai: {
        type: String,
        enum: Enum.TRANG_THAI_TIN
    },
    ngayTao: {
        type: Date,
        default: Date.now()
    },
    nhaTuyenDung: {
        type: Schema.Types.ObjectId,
        ref: 'nhaTuyenDung'
    },
    slug: String,
    lienHe: {
        ten: String,
        sdt: String,
        email: String
    },
    dsViecLamDaLuu: {
        type: [ViecLamDaLuu]
    }
})

TinTuyenDung.pre('save', function (next) {
    this.slug = slugify(this.tieuDe, { lower: true })
    next()
})

TinTuyenDung.pre(/^find/, function (next) {
    this.populate(['nganhNghe', 'nhaTuyenDung'])
    next()
})

module.exports = mongoose.model('tinTuyenDung', TinTuyenDung)