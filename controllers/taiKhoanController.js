const TaiKhoan = require('../models/taiKhoanModel');
const TngTuyenVien = require('../models/ungTuyenVienModel');
const NhaTuyenDung = require('../models/nhaTuyenDungModel');
const AppError = require('../utils/appError');
const Enum = require('../utils/enum')

class TaiKhoanController {
    async getAll(req, res, next) {
        await TaiKhoan.find()
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
        const taiKhoanMoi = new TaiKhoan(req.body);
        await taiKhoanMoi.save()
            .then((data) => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async getAPIById(req, res, next) {
        await TaiKhoan.findById(req.params.id)
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
        const taiKhoan = req.body;
        await TaiKhoan.findByIdAndUpdate(req.params.id, taiKhoan)
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch((err) => {
                res.status(500).json({
                    status: 'err',
                    message: err
                })
            });
    };

    async deleteAPI(req, res, next) {
        await TaiKhoan.findByIdAndRemove(req.params.id)
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
}
module.exports = new TaiKhoanController;