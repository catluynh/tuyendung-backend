const TaiKhoan = require('../models/taiKhoanModel');
const TinTuyenDung = require('../models/tinTuyenDungModel');
const DonUngTuyen = require('../models/donUngTuyenModel');
const AppError = require('../utils/appError');
const Enum = require('../utils/enum')

class ThongKeController {
    async soLuong(req, res, next) {
        await TaiKhoan.aggregate([
            {
                $group: {
                    _id: '$loaiTaiKhoan',
                    soLuong: { $sum: 1 }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { loaiTaiKhoan: "$_id", soLuong: '$soLuong' }
                }
            }
        ]).exec().then(datas => {
            let sLNhaTuyenDung, sLUngTuyenVien;
            datas.map(data => {
                if (data.loaiTaiKhoan == Enum.LOAI_TAI_KHOAN.NHA_TUYEN_DUNG) {
                    sLNhaTuyenDung = data.soLuong;
                }
                if (data.loaiTaiKhoan == Enum.LOAI_TAI_KHOAN.UNG_TUYEN_VIEN) {
                    sLUngTuyenVien = data.soLuong;
                }
            })

            res.status(200).json({
                status: 'success',
                results: (sLUngTuyenVien || 0) + (sLNhaTuyenDung || 0),
                data: {
                    sLUngTuyenVien,
                    sLNhaTuyenDung
                }
            })
        }).catch(next);
    }

    async tinTuyenDung(req, res, next) {
        console.log(req.query);
        await TinTuyenDung.aggregate([
            {
                $group: {
                    _id: '$' + req.query.field + '',
                    soLuong: { $sum: 1 }
                }
            }
        ]).then(data => {
            res.status(200).json({
                status: 'success',
                data
            })
        }).catch(next);
    }

    async donUngTuyen(req, res, next) {
        await DonUngTuyen.aggregate([
            {
                $group: {
                    _id: '$trangThai',
                    soLuong: { $sum: 1 }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { trangThai: "$_id", soLuong: '$soLuong' }
                }
            }
        ]).then(datas => {
            let sLDonDangUngTuyen, sLDonDaUngTuyen, sLDonThatBai;
            datas.map(data => {
                if (data.trangThai == Enum.TRANG_THAI_DON.DANG_UNG_TUYEN) {
                    sLDonDangUngTuyen = data.soLuong;
                }
                else if (data.trangThai == Enum.TRANG_THAI_DON.DA_UNG_TUYEN) {
                    sLDonDaUngTuyen = data.soLuong;
                }
                else {
                    sLDonThatBai = data.soLuong;
                }
            })
            res.status(200).json({
                status: 'success',
                results: (sLDonDangUngTuyen || 0) + (sLDonDaUngTuyen || 0) + (sLDonThatBai || 0),
                data: {
                    sLDonDangUngTuyen,
                    sLDonDaUngTuyen,
                    sLDonThatBai
                }
            })
        }).catch(next);
    }

    // top 12 tin ứng tuyển nhiều nhất
    async tinNoiBat(req, res, next) {
        console.log(req.query);
        const page = req.query.page * 1 || 1
        const limit = 12;
        const skip = (page - 1) * limit;
        await DonUngTuyen.aggregate([
            {
                $group: {
                    _id: '$tinTuyenDung',
                    soLuong: { $sum: 1 }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { trangThai: "$_id", soLuong: '$soLuong' }
                }
            }
        ])
            .limit(limit)
            .skip(skip)
            .sort({ 'soLuong': -1 })
            .exec()
            .then(data => {
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    };
}
module.exports = new ThongKeController;