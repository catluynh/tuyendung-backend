const UngTuyenVien = require('../models/ungTuyenVienModel');
const AppError = require('../utils/appError');
const uploadHinhAnh = require('../utils/UploadHinhAnh');

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

    async capNhatAvatar(req, res, next) {
        const file = req.files.file;
        console.log(file);
        const ungTuyenVien = await UngTuyenVien.findById(req.taiKhoan._id);
        console.log(req.taiKhoan)
        ungTuyenVien.avatar = file.name;
        await UngTuyenVien.findByIdAndUpdate(req.taiKhoan._id, ungTuyenVien)
            .then(data => {
                uploadHinhAnh.luuDSHinhAnh(file);
                // uploadHinhAnh.xoaHinhAnh(data.avatar)
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };
}

module.exports = new UngTuyenVienController;