const NhaTuyenDung = require('../models/nhaTuyenDungModel')

class NhaTuyenDungController {
    async getAll(req, res, next) {
        await NhaTuyenDung.find().populate('taiKhoan')
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
        const nhaTuyenDungMoi = new NhaTuyenDung(req.body);
        nhaTuyenDungMoi._id = req.taiKhoan._id;
        await nhaTuyenDungMoi.save()
            .then((data) => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async getAPIById(req, res, next) {
        await NhaTuyenDung.findById(req.params.id).populate('taiKhoan')
            .then(data => {
                if (!data) {
                    return next(new AppError('Nhà tuyển dụng không tìm thấy', 404))
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
        await NhaTuyenDung.findByIdAndUpdate(req.params.id, data)
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async deleteAPI(req, res, next) {
        await NhaTuyenDung.findByIdAndRemove(req.params.id)
            .then(data => {
                if (!data) {
                    return next(new AppError('Nhà tuyển dụng không tìm thấy', 404))
                }
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };
}

module.exports = new NhaTuyenDungController;