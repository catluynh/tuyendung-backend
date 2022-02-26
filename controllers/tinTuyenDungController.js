const TinTuyenDung = require('../models/tinTuyenDungModel');
const NganhNghe = require('../models/nganhNgheModel');
const LinhVuc = require('../models/linhVucModel');
const NhaTuyenDung = require('../models/nhaTuyenDungModel');
const AppError = require('../utils/appError');
const Enum = require('../utils/enum');

class TinTuyenDungController {
    async getAll(req, res, next) {
        await TinTuyenDung.find()
            .then(data => {
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    }

    async postAPI(req, res, next) {
        const tinTuyenDungMoi = new TinTuyenDung(req.body);
        tinTuyenDungMoi.trangThai = Enum.TRANG_THAI_TIN.CHO_DUYET;
        await tinTuyenDungMoi.save()
            .then((data) => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async getAPIById(req, res, next) {
        await TinTuyenDung.findById(req.params.id)
            .populate({
                path: 'nganhNghe',
                populate: { path: 'linhVuc' }
            })
            .populate('nhaTuyenDung')
            .then(data => {
                if (!data) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Không tìm thấy',
                    });
                }
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async updateAPI(req, res, next) {
        const data = req.body;
        await TinTuyenDung.findByIdAndUpdate(req.params.id, data)
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async deleteAPI(req, res, next) {
        await TinTuyenDung.findByIdAndRemove(req.params.id)
            .then(data => {
                if (!data) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Không tìm thấy',
                    });
                }
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async timKiemTheoNhieuTieuChi(req, res, next) {
        console.log(req.query);
        const page = req.query.page * 1 || 1
        const limit = 2;
        const skip = (page - 1) * limit;
        const linhVuc = await LinhVuc.find({
            "tenLinhVuc": { $regex: new RegExp(req.query.linhVuc, "i") },
        })

        const nganhNghe = await NganhNghe.find({
            linhVuc,
            "tenNganhNghe": { $regex: new RegExp(req.query.nganhNghe, "i") },
        })
        await TinTuyenDung.find({
            nganhNghe,
            "diaDiem.tinhThanhPho": { $regex: new RegExp(req.query.diaDiem, "i") },
            "viTri": { $regex: new RegExp(req.query.viTri, "i") },
            "soNamKinhNghiem": { $regex: new RegExp(req.query.soNamKinhNghiem, "i") },
            "loaiCongViec": { $regex: new RegExp(req.query.loaiCongViec, "i") },
        }).limit(limit).skip(skip).exec()
            .then(data => {
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    }

    async timKiemTheoNhaTuyenDung(req, res, next) {
        console.log(req.query);
        const page = req.query.page * 1 || 1
        const limit = 2;
        const skip = (page - 1) * limit;
        const linhVuc = await LinhVuc.find({
            "tenLinhVuc": { $regex: new RegExp(req.query.linhVuc, "i") },
        })

        const nganhNghe = await NganhNghe.find({
            linhVuc,
            "tenNganhNghe": { $regex: new RegExp(req.query.nganhNghe, "i") },
        })

        const nhaTuyenDung = await NhaTuyenDung.findById(req.taiKhoan._id);
        await TinTuyenDung.find({
            nhaTuyenDung,
            nganhNghe,
            "diaDiem.tinhThanhPho": { $regex: new RegExp(req.query.diaDiem, "i") },
            "viTri": { $regex: new RegExp(req.query.viTri, "i") },
            "soNamKinhNghiem": { $regex: new RegExp(req.query.soNamKinhNghiem, "i") },
            "loaiCongViec": { $regex: new RegExp(req.query.loaiCongViec, "i") },
        }).limit(limit).skip(skip).exec()
            .then(data => {
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    }

    async duyetTin(req, res, next) {
        await TinTuyenDung.findById(req.params.id)
            .then(data => {
                data.trangThai = Enum.TRANG_THAI_TIN.DA_DUYET;
                data.save();
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    }

    async khoaTin(req, res, next) {
        await TinTuyenDung.findById(req.params.id)
            .then(data => {
                data.trangThai = Enum.TRANG_THAI_TIN.KHOA;
                data.save();
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    }

    async dungTuyen(req, res, next) {
        await TinTuyenDung.findById(req.params.id)
            .then(data => {
                data.trangThai = Enum.TRANG_THAI_TIN.DUNG_TUYEN;
                data.save();
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    }
}
module.exports = new TinTuyenDungController;