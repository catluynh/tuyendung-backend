const AppError = require('../utils/appError');
const TaiKhoan = require('../models/taiKhoanModel');
const QuanTriVien = require('../models/quanTriVienModel');

class QuanTriVienController {
    async getAll(req, res, next) {
        await QuanTriVien.find()
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
        const quanTriVienMoi = new QuanTriVien(req.body);
        await quanTriVienMoi.save()
            .then((data) => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async getAPIById(req, res, next) {
        await QuanTriVien.findById(req.params.id)
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
        await QuanTriVien.findByIdAndUpdate(req.params.id, data)
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async deleteAPI(req, res, next) {
        await QuanTriVien.findByIdAndRemove(req.params.id)
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

    async khoaTaiKhoan(req, res, next) {
        await TaiKhoan.findById(req.params.id)
            .then(data => {
                if (!data) {
                    return next(new AppError('Không tìm thấy', 404))
                }
                data.trangThai = false;
                data.save();
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    }

    async moTaiKhoan(req, res, next) {
        await TaiKhoan.findById(req.params.id)
            .then(data => {
                if (!data) {
                    return next(new AppError('Không tìm thấy', 404))
                }
                data.trangThai = true;
                data.save();
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    }

}
module.exports = new QuanTriVienController;