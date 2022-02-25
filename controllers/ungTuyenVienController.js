const UngTuyenVien = require('../models/ungTuyenVienModel');
const AppError = require('../utils/appError');

class UngTuyenVienController {
    async getAll(req, res, next) {
        await UngTuyenVien.find().populate('taiKhoan')
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
        const ungTuyenVienMoi = new UngTuyenVien(req.body);
        ungTuyenVienMoi._id = req.taiKhoan._id;
        await ungTuyenVienMoi.save()
            .then((data) => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async getAPIById(req, res, next) {
        await UngTuyenVien.findById(req.params.id).populate('taiKhoan')
            .then(data => {
                if (!data) {
                     return res.status(404).json({
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
        await UngTuyenVien.findByIdAndUpdate(req.params.id, data)
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async deleteAPI(req, res, next) {
        await UngTuyenVien.findByIdAndRemove(req.params.id)
            .then(data => {
                if (!data) {
                     return res.status(404).json({
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
}

module.exports = new UngTuyenVienController;