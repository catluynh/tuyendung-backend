const TinTuyenDung = require('../models/tinTuyenDungModel')

class TinTuyenDungController {
    async getAll(req, res, next) {
        await TinTuyenDung.find().populate({
            path: 'nganhNghe',
            populate: { path: 'linhVuc' }
        })
            .populate('nhaTuyenDung')
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
                    return next(new AppError('Không tìm thấy', 404))
                }
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };
}
module.exports = new TinTuyenDungController;