const ViecLamQuanTam = require('../models/viecLamQuanTam');
const AppError = require('../utils/appError');

class ViecLamQuanTamController {
    async getAll(req, res, next) {
        await ViecLamQuanTam.find()
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
        const viecLamQuanTamMoi = new ViecLamQuanTam(req.body);
        viecLamQuanTamMoi.ungTuyenVien = req.taiKhoan._id;
        await viecLamQuanTamMoi.save()
            .then((data) => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async getAPIById(req, res, next) {
        await ViecLamQuanTam.findById(req.params.id)
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

    async timTheoUngTuyenVien(req, res, next) {
        await ViecLamQuanTam.find({ "ungTuyenVien": req.taiKhoan._id })
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
        await ViecLamQuanTam.findByIdAndUpdate(req.params.id, data)
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async deleteAPI(req, res, next) {
        await ViecLamQuanTam.findByIdAndRemove(req.params.id)
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
module.exports = new ViecLamQuanTamController;