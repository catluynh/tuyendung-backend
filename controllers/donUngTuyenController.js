const DonUngTuyen = require('../models/donUngTuyenModel');
const UngTuyenVien = require('../models/ungTuyenVienModel');
const TinTuyenDung = require('../models/tinTuyenDungModel');
const Enum = require('../utils/enum');
const AppError = require('../utils/appError');

class DonUngTuyenController {
    async getAll(req, res, next) {
        await DonUngTuyen.find()
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
        const donUngTuyenMoi = new DonUngTuyen(req.body);
        donUngTuyenMoi.trangThai = Enum.TRANG_THAI_DON.DANG_UNG_TUYEN;
        await donUngTuyenMoi.save()
            .then((data) => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async getAPIById(req, res, next) {
        await DonUngTuyen.findById(req.params.id)
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
        await DonUngTuyen.findByIdAndUpdate(req.params.id, data)
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async deleteAPI(req, res, next) {
        await DonUngTuyen.findByIdAndRemove(req.params.id)
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

    async timKiemTheoUngTuyenVien(req, res, next) {
        console.log(req.query);
        const page = req.query.page * 1 || 1
        const limit = 5;
        const skip = (page - 1) * limit;
        await DonUngTuyen.find({ ungTuyenVien: req.taiKhoan._id })
            .limit(limit).skip(skip).exec()
            .then(data => {
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    };

    async timKiemTheoTinTuyenDung(req, res, next) {
        console.log(req.query);
        const page = req.query.page * 1 || 1
        const limit = 5;
        const skip = (page - 1) * limit;
        await DonUngTuyen.find({ tinTuyenDung: req.params.id })
            .limit(limit).skip(skip).exec()
            .then(data => {
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    };

    async ungTuyen(req, res, next) {
        await DonUngTuyen.findById(req.params.id)
            .then(data => {
                data.trangThai = Enum.TRANG_THAI_DON.DA_UNG_TUYEN;
                data.save();
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    };

    async tuChoiUngTuyen(req, res, next) {
        await DonUngTuyen.findById(req.params.id)
            .then(data => {
                data.trangThai = Enum.TRANG_THAI_DON.THAT_BAI;
                data.save();
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    };

    // top 12 tin ứng tuyển nhiều nhất
    async tinNoiBat(req, res, next) {
        const limit = 12;
        await DonUngTuyen.aggregate([
            {
                $group: {
                    _id: '$tinTuyenDung',
                    soLuong: { $sum: 1 }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { idTinTuyenDung: "$_id", soLuong: '$soLuong' }
                }
            }
        ])
            .limit(limit)
            .sort({ 'soLuong': -1 })
            .exec()
            .then(async datas => {
                const dsTin = datas.map(async data => {
                    return await TinTuyenDung.findById(data.idTinTuyenDung);
                })
                res.status(200).json({
                    status: 'success',
                    results: datas.length,
                    data: await Promise.all(dsTin)
                })
            })
            .catch(next);
    };
}
module.exports = new DonUngTuyenController;