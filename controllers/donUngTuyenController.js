const DonUngTuyen = require('../models/donUngTuyenModel')

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
}
module.exports = new DonUngTuyenController;