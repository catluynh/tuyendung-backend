const NhaTuyenDung = require('../models/nhaTuyenDungModel');
const TinTuyenDung = require('../models/tinTuyenDungModel');
const AppError = require('../utils/appError');

class NhaTuyenDungController {
    async getAll(req, res, next) {
        const page = req.query.page * 1 || 1
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const totalAll = await NhaTuyenDung.aggregate([
            { $lookup: { from: "taikhoans", localField: "_id", foreignField: "_id", as: "taiKhoan" } },
            { $unwind: "$taiKhoan" },
            {
                $match: {
                    $and: [
                        { tenCongty: { $regex: new RegExp(req.query.tenCongty, "i") } },
                        { sdt: { $regex: new RegExp(req.query.sdt, "i") } }
                    ]
                }
            },
            { $count: 'tong' }
        ]);
        const total = totalAll[0];
        await NhaTuyenDung.aggregate([
            { $lookup: { from: "taikhoans", localField: "_id", foreignField: "_id", as: "taiKhoan" } },
            { $unwind: "$taiKhoan" },
            {
                $match: {
                    $and: [
                        { tenCongty: { $regex: new RegExp(req.query.tenCongty, "i") } },
                        { sdt: { $regex: new RegExp(req.query.sdt, "i") } }
                    ]
                }
            },
            { $sort: { 'taiKhoan.ngayCapNhat': -1 } },
            { $skip: skip },
            { $limit: limit },
        ])
            .then(data => {
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    pagination: {
                        page,
                        limit,
                        total,
                    },
                    data
                })
            })
            .catch(next);
    }

    async nhaTuyenDungTheoSoLuongTin(req, res, next) {
        const page = req.query.page * 1 || 1
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const total = await TinTuyenDung.aggregate([
            { $lookup: { from: "nhatuyendungs", localField: "nhaTuyenDung", foreignField: "_id", as: "rs" } },
            { $count: 'tong' }
        ])

        await TinTuyenDung.aggregate([
            { $lookup: { from: "nhatuyendungs", localField: "nhaTuyenDung", foreignField: "_id", as: "rs" } },
            { $unwind: "$rs" },
            {

                $group: {
                    _id: {
                        _id: '$nhaTuyenDung', tenCongTy: '$rs.tenCongty', email: '$rs.email', sdt: '$rs.sdt', moTa: '$rs.moTa', quyMo: '$rs.quyMo', namThanhLap: '$rs.namThanhLap', diaChi: '$rs.diaChi'
                    },
                    soLuongTinDaDang: { $sum: 1 }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { nhaTuyenDung: "$_id", soLuongTinDaDang: '$soLuongTinDaDang' }
                }
            },
            { $skip: skip },
        ]).limit(limit).exec()
            .then(data => {
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    pagination: {
                        page,
                        limit,
                        total: total[0].tong,
                    },
                    data
                })
            })
            .catch(next);
    }

    async postAPI(req, res, next) {
        const nhaTuyenDungMoi = new NhaTuyenDung(req.body);
        nhaTuyenDungMoi._id = req.taiKhoan._id;
        nhaTuyenDungMoi.taiKhoan = req.taiKhoan._id;
        await nhaTuyenDungMoi.save()
            .then((data) => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async getAPIBySlug(req, res, next) {
        await NhaTuyenDung.find({ slug: req.params.slug }).populate('taiKhoan')
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

    async getAPIById(req, res, next) {
        await NhaTuyenDung.findById(req.params.id).populate('taiKhoan')
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
        const nhaTuyenDung = await NhaTuyenDung.findById(req.taiKhoan._id);
        nhaTuyenDung.avatar = file.name;
        await NhaTuyenDung.findByIdAndUpdate(req.taiKhoan._id, nhaTuyenDung)
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

module.exports = new NhaTuyenDungController;