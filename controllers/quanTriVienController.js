const AppError = require('../utils/appError');
const TaiKhoan = require('../models/taiKhoanModel');
const QuanTriVien = require('../models/quanTriVienModel');
const Enum = require('../utils/enum');

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

    async khoaTaiKhoan(req, res, next) {
        await TaiKhoan.findById(req.params.id)
            .then(data => {
                if (!data) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Không tìm thấy',
                    });
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
                console.log(data)
                if (!data) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Không tìm thấy',
                    });
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