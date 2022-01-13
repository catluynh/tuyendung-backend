const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Enum = require('../utils/enum');

const KyNangChuyenMon = new Schema({
    tenKyNang: {
        type: String
    }
})

const HocVan = new Schema({
    donViDaoTao: {
        type: String
    },
    bangCap: {
        type: String,
        enum: Enum.BANG_CAP
    },
    moTa: {
        type: String
    },
    tuNgay: {
        type: Date
    },
    denNgay: {
        type: Date
    },
})

const KinhNghiemLamViec = new Schema({
    congTy: {
        type: String
    },
    viTri: {
        type: String,
        enum: Enum.VI_TRI
    },
    moTa: {
        type: String
    },
    tuNgay: {
        type: Date
    },
    denNgay: {
        type: Date
    },
})


const ChungChi = new Schema({
    tenChungChi: {
        type: String
    },
    donViCungCap: {
        type: String
    },
    ngayCap: {
        type: Date
    },
    ngayHetHan: {
        type: Date
    }
})


const UngTuyenVien = new Schema({
    ten: {
        type: String
    },
    sdt: {
        type: String
    },
    gioiTinh: {
        type: String
    },
    diaChi: {
        type: String
    },
    loiGioiThieu: {
        type: String,
    },
    soNamKinhNghiem: {
        type: String,
        enum: Enum.SO_NAM_KINH_NGHIEM
    },
    avatar: {
        type: String,
        default: 'utv-avatar-default.png',
    },
    dsKyNangChuyenMon: {
        type: [KyNangChuyenMon]
    },
    dsHocVan: {
        type: [HocVan]
    },
    dsKinhNghiemLamViec: {
        type: [KinhNghiemLamViec]
    },
    dsChungChi: {   
        type: [ChungChi]
    },
    taiKhoan: {
        type: Schema.Types.ObjectId,
        ref: 'taiKhoan'
    }
})

UngTuyenVien.pre(/^find/, function (next) {
    this.populate('taiKhoan')
    next()
})

module.exports = mongoose.model('ungTuyenVien', UngTuyenVien)