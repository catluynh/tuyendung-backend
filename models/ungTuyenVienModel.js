const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
        enum: ['Trung học', 'Trung cấp', 'Cao Đẳng', 'Đại học', 'Sau đại học', 'Nghề', 'Chưa tốt nghiệp', 'Khác']
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
        enum: ['Sinh viên/Thực tập', 'Mới tốt nghiệp', 'Nhân viên', 'Trưởng phòng', 'Giám sát', 'Quản lý', 'Phó giám đốc', 'Khác']
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
        type: String,
        required: 'Tên ứng tuyển viên không được để trống'
    },
    sdt: {
        type: String
    },
    gioiTinh: {
        type: String,
        required: 'Giới tính ứng tuyển viên không được để trống'
    },
    diaChi: {
        type: String,
        reqired: 'Địa chỉ ứng tuyển viên không được để trống'
    },
    loiGioiThieu: {
        type: String,
    },
    soNamKinhNghiem: {
        type: String,
        enum: ['Chưa có kinh nghiệm', 'Dưới 1 năm', '1 năm', '2 năm', '3 năm', '4 năm', '5 năm', 'Trên 5 năm']
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

module.exports = mongoose.model('ungTuyenVien', UngTuyenVien)