const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TinTuyenDung = new Schema({
    tieuDe: String,
    viTri: {
        type: String,
        enum: ['Sinh viên/Thực tập', 'Mới tốt nghiệp', 'Nhân viên', 'Trưởng phòng', 'Giám sát', 'Quản lý', 'Phó giám đốc', 'Khác']
    },
    soLuongTuyen: Number,
    loaiCongViec: {
        type: String,
        enum: ['Toàn thời gian', 'Bán thời gian', 'Thực tập sinh', 'Khác']
    },
    ngayHetHan: Date,
    soNamKinhNghiem: {
        type: String,
        enum: ['Chưa có kinh nghiệm', 'Dưới 1 năm', '1 năm', '2 năm', '3 năm', '4 năm', '5 năm', 'Trên 5 năm']
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
        enum: ['Trung học', 'Trung cấp', 'Cao Đẳng', 'Đại học', 'Sau đại học', 'Nghề', 'Chưa tốt nghiệp', 'Không yêu cầu']
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
    phucLoi: [{
        tenPhucLoi: String
    }],
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
        enum: ['Đã duyệt', 'Chờ duyệt', 'Dừng tuyển']
    },
    ngayTao: Date,
    nhaTuyenDung: {
        type: Schema.Types.ObjectId,
        ref: 'nhaTuyenDung'
    }
})

TinTuyenDung.pre(/^find/, function (next) {
    this.populate(['nganhNghe', 'nhaTuyenDung'])
    next()
})

module.exports = mongoose.model('tinTuyenDung', TinTuyenDung)