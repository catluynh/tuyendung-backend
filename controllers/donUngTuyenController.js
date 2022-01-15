const DonUngTuyen = require('../models/donUngTuyenModel');
const UngTuyenVien = require('../models/ungTuyenVienModel');
const TinTuyenDung = require('../models/tinTuyenDungModel');

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
                    return next(new AppError('Không tìm thấy', 404))
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
                    return next(new AppError('Không tìm thấy', 404))
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
}
module.exports = new DonUngTuyenController;