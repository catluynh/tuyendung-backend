const TinNhan = require('../models/tinNhanModel');
const AppError = require('../utils/appError');

class TinNhanController {
    async getAll(req, res, next) {
        await TinNhan.find()
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
        const tinNhanMoi = new TinNhan(req.body);
        await tinNhanMoi.save()
            .then((data) => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async getAPIById(req, res, next) {
        await TinNhan.findById(req.params.id)
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
        await TinNhan.findByIdAndUpdate(req.params.id, data)
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async deleteAPI(req, res, next) {
        await TinNhan.findByIdAndRemove(req.params.id)
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

    timDsTinNhanTheoId(req, res, next) {
        console.log(req.query);
        const page = req.query.page * 1 || 1;
        const limit = 5;
        const skip = (page - 1) * limit;
        TinNhan.find({
            '$or':
                [{
                    '$and':
                        [{ 'idNguoiGui': req.params.idNguoiGui },
                        { 'idNguoiNhan': req.params.idNguoiNhan }]
                },
                {
                    '$and':
                        [{ 'idNguoiGui': req.params.idNguoiNhan },
                        { 'idNguoiNhan': req.params.idNguoiGui }]
                }]
        }).limit(limit).skip(skip).exec()
            .then(data => {
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    }
}
module.exports = new TinNhanController;