const NganhNghe = require('../models/nganhNgheModel');
const LinhVuc = require('../models/linhVucModel');
const AppError = require('../utils/appError');

class NganhNgheController {
    async getAll(req, res, next) {
        await NganhNghe.find()
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
        const nganhNgheMoi = new NganhNghe(req.body);
        await nganhNgheMoi.save()
            .then((data) => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async getAPIById(req, res, next) {
        await NganhNghe.findById(req.params.id)
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
        await NganhNghe.findByIdAndUpdate(req.params.id, data)
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async deleteAPI(req, res, next) {
        await NganhNghe.findByIdAndRemove(req.params.id)
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


    // xu hướng các ngành nghề phổ biến, có sl nhiều nghành nghề nhất
    async xuHuongNganhNghe(req, res, next) {
        const limit = 8;
        await NganhNghe.aggregate([
            {
                $group: {
                    _id: '$linhVuc',
                    soLuong: { $sum: 1 }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { idLinhVuc: "$_id", soLuong: '$soLuong' }
                }
            }
        ])
            .limit(limit)
            .sort({ 'soLuong': -1 })
            .exec()
            .then(async datas => {
                const dsLinhVuc = datas.map(async data => {
                    return await LinhVuc.findById(data.idLinhVuc);
                })
                res.status(200).json({
                    status: 'success',
                    results: datas.length,
                    data: await Promise.all(dsLinhVuc)
                })
            })
            .catch(next);
    };

    async timKiemNgheTheoIDLinhVuc(req, res, next) {
        await NganhNghe.find({
            'linhVuc': req.params.idLinhVuc
        })
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
module.exports = new NganhNgheController;