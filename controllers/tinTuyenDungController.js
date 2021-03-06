const TinTuyenDung = require('../models/tinTuyenDungModel');
const NganhNghe = require('../models/nganhNgheModel');
const LinhVuc = require('../models/linhVucModel');
const NhaTuyenDung = require('../models/nhaTuyenDungModel');
const DonUngTuyen = require('../models/donUngTuyenModel');
const ViecLamQuanTam = require('../models/viecLamQuanTam');
const AppError = require('../utils/appError');
const Enum = require('../utils/enum');
const moment = require('moment');
const paypal = require('paypal-rest-sdk');
var open = require('open');
const { find } = require('../models/tinTuyenDungModel');
const guiEmail = require('../utils/email');
const mongoose = require('mongoose');

paypal.configure({
    'mode': process.env.MODE, //sandbox or live
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
});


class TinTuyenDungController {

    async kiemTraDungTuyen(req, res, next) {
        await TinTuyenDung.aggregate([
            { $lookup: { from: "donungtuyens", localField: "_id", foreignField: "tinTuyenDung", as: "rs" } },
            { $unwind: "$rs" },
            { $match: { 'rs.trangThai': 'Đã ứng tuyển' } },
            {
                $group: {
                    _id:
                        { tinTuyenDung: '$_id', tieuDe: '$tieuDe', ngayHetHan: '$ngayHetHan', soLuongTuyen: '$soLuongTuyen' },
                    soLuongDaTuyen: { $sum: 1 }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { tinTuyenDung: "$_id", soLuongDaTuyen: '$soLuongDaTuyen' }
                }
            }
        ])
            .then(datas => {
                datas.map(async data => {
                    if (data.tinTuyenDung.ngayHetHan < Date.now() || data.soLuongDaTuyen >= data.tinTuyenDung.soLuongTuyen) {
                        await TinTuyenDung.findByIdAndUpdate(data.tinTuyenDung.tinTuyenDung, {
                            trangThai: Enum.TRANG_THAI_TIN.DUNG_TUYEN,
                            soLuongDaTuyen: data.soLuongDaTuyen
                        })
                    }
                })
                next()
            })
            .catch(next);

    }
    async getAll(req, res, next) {
        await TinTuyenDung.find()
            .then(async data => {
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
        tinTuyenDungMoi.nhaTuyenDung = req.taiKhoan._id
        tinTuyenDungMoi.trangThai = Enum.TRANG_THAI_TIN.CHO_DUYET;
        tinTuyenDungMoi.ngayCapNhat = new Date();
        await tinTuyenDungMoi.save()
            .then((data) => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async tinTheoNhaTuyenDung(req, res, next) {
        const page = req.query.page * 1 || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const total = await TinTuyenDung.find({ nhaTuyenDung: req.params.idNhaTuyenDung }).count();
        await TinTuyenDung.find({ nhaTuyenDung: req.params.idNhaTuyenDung }).limit(limit).skip(skip).exec()
            .then(data => {
                res.status(201).json({
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
    };

    async getAPIBySlug(req, res, next) {
        await TinTuyenDung.find({ slug: req.params.slug })
            .populate({
                path: 'nganhNghe',
                populate: { path: 'linhVuc' }
            })
            .populate('nhaTuyenDung')
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
        await TinTuyenDung.findById(req.params.id)
            .populate({
                path: 'nganhNghe',
                populate: { path: 'linhVuc' }
            })
            .populate('nhaTuyenDung')
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
        await TinTuyenDung.findByIdAndUpdate(req.params.id, data)
            .then(async data => {
                res.status(201).json({
                    status: 'success',
                    data: await TinTuyenDung.findById(data._id)
                })
            })
            .catch(next);
    };

    async deleteAPI(req, res, next) {
        console.log(req.params.id)
        await TinTuyenDung.findByIdAndRemove(req.params.id)
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

    async timKiemTheoNhieuTieuChi(req, res, next) {
        try {
            // moment(ngay).format('DD-MM-yyyy')
            const tuNgay = req.query.tuNgay || 1;
            const denNgay = (req.query.denNgay || moment(Date.now()).format('yyyy-MM-DD')) + 'T23:59:59.580';
            const page = req.query.page * 1 || 1
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            var trangThai;

            if (req.query.trangThai == 0) {
                trangThai = 'Khóa'
            }
            if (req.query.trangThai == 1) {
                trangThai = 'Chờ duyệt'
            }
            if (req.query.trangThai == 2) {
                trangThai = 'Đã duyệt'
            }
            if (req.query.trangThai == 3) {
                trangThai = 'Dừng tuyển'
            }
            if (req.query.trangThai == 4) {
                trangThai = 'Từ chối'
            }

            const linhVuc = await LinhVuc.find({
                "tenLinhVuc": { $regex: new RegExp(req.query.linhVuc, "i") },
            })

            const nganhNghe = await NganhNghe.find({
                linhVuc,
                "tenNganhNghe": { $regex: new RegExp(req.query.nganhNghe, "i") },
            })

            const total = await TinTuyenDung.find({
                nganhNghe,
                "trangThai": { $regex: new RegExp(trangThai, "i") },
                "tieuDe": { $regex: new RegExp(req.query.tieuDe, "i") },
                "diaDiem.tinhThanhPho": { $regex: new RegExp(req.query.diaDiem, "i") },
                "viTri": { $regex: new RegExp(req.query.viTri, "i") },
                "soNamKinhNghiem": { $regex: new RegExp(req.query.soNamKinhNghiem, "i") },
                "loaiCongViec": { $regex: new RegExp(req.query.loaiCongViec, "i") },
                $and: [{ "ngayTao": { '$gte': tuNgay } }, { "ngayTao": { '$lte': denNgay } }]
            }).count();

            await TinTuyenDung.find({
                nganhNghe,
                "trangThai": { $regex: new RegExp(trangThai, "i") },
                "tieuDe": { $regex: new RegExp(req.query.tieuDe, "i") },
                "diaDiem.tinhThanhPho": { $regex: new RegExp(req.query.diaDiem, "i") },
                "viTri": { $regex: new RegExp(req.query.viTri, "i") },
                "soNamKinhNghiem": { $regex: new RegExp(req.query.soNamKinhNghiem, "i") },
                "loaiCongViec": { $regex: new RegExp(req.query.loaiCongViec, "i") },
                $and: [{ "ngayTao": { '$gte': tuNgay } }, { "ngayTao": { '$lte': denNgay } }]
            }).limit(limit).skip(skip).exec()
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
        } catch (error) {
            return res.status(400).json({
                message: error,
            });
        }
    }

    async timKiemTheoNhaTuyenDung(req, res, next) {
        console.log(req.query);
        const tuNgay = req.query.tuNgay || 1;
        const denNgay = (req.query.denNgay || moment(Date.now()).format('yyyy-MM-DD')) + 'T23:59:59.580';
        const page = req.query.page * 1 || 1
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        var trangThai;

        if (req.query.trangThai == 0) {
            trangThai = 'Khóa'
        }
        if (req.query.trangThai == 1) {
            trangThai = 'Chờ duyệt'
        }
        if (req.query.trangThai == 2) {
            trangThai = 'Đã duyệt'
        }
        if (req.query.trangThai == 3) {
            trangThai = 'Dừng tuyển'
        }
        if (req.query.trangThai == 4) {
            trangThai = 'Từ chối'
        }

        const linhVuc = await LinhVuc.find({
            "tenLinhVuc": { $regex: new RegExp(req.query.linhVuc, "i") },
        })

        const nganhNghe = await NganhNghe.find({
            linhVuc,
            "tenNganhNghe": { $regex: new RegExp(req.query.nganhNghe, "i") },
        })

        const nhaTuyenDung = await NhaTuyenDung.findById(req.taiKhoan._id);

        //đếm số lượng
        const total = await TinTuyenDung.find({
            nhaTuyenDung,
            nganhNghe,
            "tieuDe": { $regex: new RegExp(req.query.tieuDe, "i") },
            "trangThai": { $regex: new RegExp(trangThai, "i") },
            "diaDiem.tinhThanhPho": { $regex: new RegExp(req.query.diaDiem, "i") },
            "viTri": { $regex: new RegExp(req.query.viTri, "i") },
            "soNamKinhNghiem": { $regex: new RegExp(req.query.soNamKinhNghiem, "i") },
            "loaiCongViec": { $regex: new RegExp(req.query.loaiCongViec, "i") },
            $and: [{ "ngayTao": { '$gte': tuNgay } }, { "ngayTao": { '$lte': denNgay } }]
        }).count();

        await TinTuyenDung.find({
            nhaTuyenDung,
            nganhNghe,
            "tieuDe": { $regex: new RegExp(req.query.tieuDe, "i") },
            "trangThai": { $regex: new RegExp(trangThai, "i") },
            "diaDiem.tinhThanhPho": { $regex: new RegExp(req.query.diaDiem, "i") },
            "viTri": { $regex: new RegExp(req.query.viTri, "i") },
            "soNamKinhNghiem": { $regex: new RegExp(req.query.soNamKinhNghiem, "i") },
            "loaiCongViec": { $regex: new RegExp(req.query.loaiCongViec, "i") },
            $and: [{ "ngayTao": { '$gte': tuNgay } }, { "ngayTao": { '$lte': denNgay } }]
        }).limit(limit).skip(skip).sort({ ngayCapNhat: -1 }).exec()
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

    async duyetTin(req, res, next) {
        await TinTuyenDung.findById(req.params.id)
            .then(data => {
                data.trangThai = Enum.TRANG_THAI_TIN.DA_DUYET;
                data.ngayCapNhat = new Date();
                data.save();
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    }

    async khoaTin(req, res, next) {
        await TinTuyenDung.findById(req.params.id)
            .then(data => {
                if (data.trangThai == Enum.TRANG_THAI_TIN.DA_DUYET || data.trangThai == Enum.TRANG_THAI_TIN.DUNG_TUYEN) {
                    data.trangThai = Enum.TRANG_THAI_TIN.KHOA;
                    data.ngayCapNhat = new Date();
                    data.save();
                } else if (data.trangThai == Enum.TRANG_THAI_TIN.KHOA) {
                    data.trangThai = Enum.TRANG_THAI_TIN.DA_DUYET;
                    data.ngayCapNhat = new Date();
                    data.save();
                }
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    }

    async tuChoiTin(req, res, next) {
        await TinTuyenDung.findById(req.params.id)
            .then(data => {
                data.trangThai = Enum.TRANG_THAI_TIN.TU_CHOI;
                data.ngayCapNhat = new Date();
                data.save();
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    }

    async dungTuyen(req, res, next) {
        await TinTuyenDung.findById(req.params.id)
            .then(data => {
                data.trangThai = Enum.TRANG_THAI_TIN.DUNG_TUYEN;
                data.ngayCapNhat = new Date();
                data.save();
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    }

    async tongSoTinTheoTrangThai(req, res, next) {
        await TinTuyenDung.aggregate([
            { $group: { _id: '$trangThai', tong: { $sum: 1 } } },
            {
                $replaceRoot: {
                    newRoot: { trangThai: "$_id", tong: '$tong' }
                }
            }
        ])
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    result: data.length,
                    data
                })
            })
            .catch(next);
    };

    async tongSoTinTheoTrangThaiNhaTuyenDung(req, res, next) {
        await TinTuyenDung.aggregate([
            { $match: { 'nhaTuyenDung': req.taiKhoan._id } },
            { $group: { _id: '$trangThai', tong: { $sum: 1 } } },
            {
                $replaceRoot: {
                    newRoot: { trangThai: "$_id", tong: '$tong' }
                }
            }
        ])
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    result: data.length,
                    data
                })
            })
            .catch(next);
    };

    async tinTuyenDungDaLuu(req, res, next) {
        await TinTuyenDung.find({ "dsViecLamDaLuu.ungTuyenVien": req.taiKhoan._id })
            .then(data => {
                if (!data) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Không tìm thấy',
                    });
                }
                res.status(201).json({
                    status: 'success',
                    result: data.length,
                    data
                })
            })
            .catch(next);
    };

    async luuTinTuyenDung(req, res, next) {
        const tinTuyenDung = await TinTuyenDung.findById(req.params.id);
        tinTuyenDung.dsViecLamDaLuu.push({ ungTuyenVien: req.taiKhoan._id })
        await tinTuyenDung.save()
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async huyLuuTinTuyenDung(req, res, next) {
        await TinTuyenDung.updateOne(
            { _id: req.params.id },
            { $pull: { dsViecLamDaLuu: { 'ungTuyenVien': req.taiKhoan._id } } }
        )
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async timKiemViecLamTheoNganhNghe(req, res, next) {
        console.log(req.query);
        const page = req.query.page * 1 || 1
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;
        const nganhNghe = await NganhNghe.find({
            'linhVuc': req.params.idLinhVuc
        });
        const total = await TinTuyenDung.find({ nganhNghe }).count();
        await TinTuyenDung.find({ nganhNghe })
            .limit(limit).skip(skip).exec()
            .then(data => {
                if (!data) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Không tìm thấy',
                    });
                }
                res.status(201).json({
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
    };

    // Tin đc ứng tuyển nhiều nhất
    async tinNoiBat(req, res, next) {
        await TinTuyenDung.find({ soLuongDaTuyen: { $gte: 0 }, trangThai: 'Đã duyệt' }).limit(12).sort({ soLuongDaTuyen: -1 })
            .then((data) => {
                res.status(201).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
        // await DonUngTuyen.aggregate([
        //     {
        //         $group: {
        //             _id: '$tinTuyenDung',
        //             soLuong: { $sum: 1 }
        //         }
        //     },
        //     {
        //         $replaceRoot: {
        //             newRoot: { idTinTuyenDung: "$_id", soLuong: '$soLuong' }
        //         }
        //     }
        // ])
        //     .limit(limit)
        //     .sort({ 'soLuong': -1 })
        //     .exec()
        //     .then(async datas => {
        //         const dsTin = datas.map(async data => {
        //             return await TinTuyenDung.findById(data.idTinTuyenDung);
        //         })

        //         res.status(200).json({
        //             status: 'success',
        //             results: datas.length,
        //             data: await Promise.all(dsTin)
        //         })
        //     })
        //     .catch(next);
    };

    async soLuongDanhGiaTheoTin(req, res, next) {
        console.log(req.query);
        const page = req.query.page * 1 || 1
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        var trangThai;

        if (req.query.trangThai == 0) {
            trangThai = 'Khóa'
        }
        if (req.query.trangThai == 1) {
            trangThai = 'Chờ duyệt'
        }
        if (req.query.trangThai == 2) {
            trangThai = 'Đã duyệt'
        }
        if (req.query.trangThai == 3) {
            trangThai = 'Dừng tuyển'
        }
        if (req.query.trangThai == 4) {
            trangThai = 'Từ chối'
        }
        if (req.query.trangThai == 5) {
            trangThai = undefined;
        }

        if (trangThai) {
            const total = await TinTuyenDung.aggregate([
                { $match: { "$and": [{ 'trangThai': trangThai }, { 'tieuDe': { $regex: new RegExp(req.query.tieuDe, "i") } }] } },
                { $count: 'tong' }
            ])

            await TinTuyenDung.aggregate([
                { $lookup: { from: "danhgias", localField: "_id", foreignField: "tinTuyenDung", as: "rs" } },
                { $match: { "$and": [{ 'trangThai': trangThai }, { 'tieuDe': { $regex: new RegExp(req.query.tieuDe, "i") } }] } },
                { $lookup: { from: "nganhnghes", localField: "nganhNghe", foreignField: "_id", as: "nganhNghe" } },
                { $unwind: "$nganhNghe" },
                {
                    $project: {
                        _id: 1, tieuDe: 1, ngayHetHan: 1, 'trangThai': 1, ngayTao: 1,
                        diaDiem: 1, slug: 1, ngayCapNhat: 1, bangCap: 1, mucLuong: 1, nganhNghe: 1,
                        denTuoi: 1, tuoiTu: 1, phucLoi: 1, moTa: 1, yeuCau: 1, viTri: 1, soNamKinhNghiem: 1,
                        gioiTinh: 1, loaiCongViec: 1, soLuongDaTuyen: 1, soLuongTuyen: 1, soLuotDanhGia: { $size: "$rs" }
                    }
                },
                { $sort: { ngayCapNhat: -1 } },
                { $skip: skip },
                { $limit: limit },
            ]).exec()
                .then(async data => {
                    res.status(201).json({
                        status: 'success',
                        results: data.length,
                        pagination: {
                            page,
                            limit,
                            total: total.length > 0 ? total[0].tong : 0,
                        },
                        data
                    })
                })
                .catch(next);
        } else {
            const total = await TinTuyenDung.aggregate([
                { $match: { 'tieuDe': { $regex: new RegExp(req.query.tieuDe, "i") } } },
                { $count: 'tong' }
            ])
            await TinTuyenDung.aggregate([
                { $lookup: { from: "danhgias", localField: "_id", foreignField: "tinTuyenDung", as: "rs" } },
                { $match: { 'tieuDe': { $regex: new RegExp(req.query.tieuDe, "i") } } },
                { $lookup: { from: "nganhnghes", localField: "nganhNghe", foreignField: "_id", as: "nganhNghe" } },
                { $unwind: "$nganhNghe" },
                {
                    $project: {
                        _id: 1, tieuDe: 1, ngayHetHan: 1, 'trangThai': 1, ngayTao: 1,
                        diaDiem: 1, slug: 1, ngayCapNhat: 1, bangCap: 1, mucLuong: 1, nganhNghe: 1,
                        denTuoi: 1, tuoiTu: 1, phucLoi: 1, moTa: 1, yeuCau: 1, viTri: 1, soNamKinhNghiem: 1,
                        gioiTinh: 1, loaiCongViec: 1, soLuongDaTuyen: 1, soLuongTuyen: 1, soLuotDanhGia: { $size: "$rs" }
                    }
                },
                { $sort: { ngayCapNhat: -1 } },
                { $skip: skip },
                { $limit: limit },
            ]).exec()
                .then(async data => {
                    res.status(201).json({
                        status: 'success',
                        results: data.length,
                        pagination: {
                            page,
                            limit,
                            total: total.length > 0 ? total[0].tong : 0,
                        },
                        data
                    })
                })
                .catch(next);
        }
    };

    async luuTheoIdUngTuyenVien(req, res, next) {
        await TinTuyenDung.aggregate([
            { $lookup: { from: "danhgias", localField: "_id", foreignField: "tinTuyenDung", as: "rs" } },
            { $unwind: "$rs" },
            { $match: { 'rs.xepLoai': { $lt: 3 } } },
        ])
            .then(async data => {
                res.status(201).json({
                    status: 'success',
                    total: data.length,
                    data
                })
            })
            .catch(next);
    };

    async getByIdTrangThai(req, res, next) {
        let checkUngTuyen;
        if (req.query.idUtv == 'undefined') {
            checkUngTuyen = false
        } else {
            const don = await DonUngTuyen.find({
                ungTuyenVien: req.query.idUtv,
                tinTuyenDung: req.params.id
            })
            if (don.length > 0) {
                checkUngTuyen = true
            } else {
                checkUngTuyen = false
            }
        }

        await TinTuyenDung.find({
            _id: req.params.id,
            trangThai: Enum.TRANG_THAI_TIN.DA_DUYET
        })
            .then(async datas => {
                const data = datas[0] || [];
                res.status(201).json({
                    status: 'success',
                    total: datas.length,
                    data,
                    checkUngTuyen
                })
            })
            .catch(next);
    };

    async tinTuyenDungCoNguyCoKhoa(req, res, next) {
        console.log(req.query);
        const page = req.query.page * 1 || 1
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const total = await TinTuyenDung.aggregate([
            { $lookup: { from: "danhgias", localField: "_id", foreignField: "tinTuyenDung", as: "rs" } },
            { $unwind: "$rs" },
            { $match: { 'rs.xepLoai': { $lt: 3 } } },
            {
                $group: {
                    _id:
                    {
                        _id: '$_id', tieuDe: '$tieuDe', yeuCau: "$yeuCau",
                        trangThai: '$trangThai', ngayTao: '$ngayTao', diaDiem: '$diaDiem',
                        ngayHetHan: '$ngayHetHan', denTuoi: "$denTuoi", tuoiTu: "$tuoiTu", mucLuong: "$mucLuong",
                        gioiTinh: '$gioiTinh', loaiCongViec: "$loaiCongViec", soNamKinhNghiem: "$soNamKinhNghiem",
                        phucLoi: "$phucLoi"
                    },
                    soLuotDanhGia: { $sum: 1 }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { tinTuyenDung: "$_id", soLuotDanhGia: '$soLuotDanhGia' }
                }
            },
            { $count: 'tong' }
        ]);

        await TinTuyenDung.aggregate([
            { $lookup: { from: "danhgias", localField: "_id", foreignField: "tinTuyenDung", as: "rs" } },
            { $unwind: "$rs" },
            { $lookup: { from: "nganhnghes", localField: "nganhNghe", foreignField: "_id", as: "nganhNghe" } },
            { $unwind: "$nganhNghe" },
            { $lookup: { from: "nhatuyendungs", localField: "nhaTuyenDung", foreignField: "_id", as: "nhaTuyenDung" } },
            { $unwind: "$nhaTuyenDung" },
            { $match: { 'rs.xepLoai': { $lt: 3 } } },
            {
                $group: {
                    _id:
                    {
                        _id: '$_id', tieuDe: '$tieuDe', yeuCau: "$yeuCau", moTa: "$moTa", nganhNghe: "$nganhNghe", nhaTuyenDung: "$nhaTuyenDung",
                        trangThai: '$trangThai', ngayTao: '$ngayTao', diaDiem: '$diaDiem',
                        ngayHetHan: '$ngayHetHan', denTuoi: "$denTuoi", tuoiTu: "$tuoiTu", mucLuong: "$mucLuong",
                        gioiTinh: '$gioiTinh', loaiCongViec: "$loaiCongViec", soNamKinhNghiem: "$soNamKinhNghiem",
                        phucLoi: "$phucLoi", viTri: "$viTri", bangCap: "$bangCap", soLuongDaTuyen: "$soLuongDaTuyen", soLuongTuyen: "$soLuongTuyen"
                    },
                    soLuotDanhGia: { $sum: 1 }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { tinTuyenDung: "$_id", soLuotDanhGia: '$soLuotDanhGia' }
                }
            },
            { $sort: { ngayCapNhat: -1 } },
            { $skip: skip },
            { $limit: limit },
        ]).exec()
            .then(async data => {
                res.status(201).json({
                    status: 'success',
                    results: data.length,
                    pagination: {
                        page,
                        limit,
                        total: total.length > 0 ? total[0].tong : 0
                    },
                    data
                })
            })
            .catch(next);
    };

    async sendEmail(req, res, next) {
        console.log(req.body)
        await guiEmail({
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message,
            html: `${req.body.message}`
        })
            .then(async datas => {
                res.status(201).json({
                    status: 'success',
                })
            })
            .catch(next);
    };

    async thanhToan(req, res, next) {
        try {
            console.log(process.env.HOST_CLIENT)
            const items = [{
                "name": "Thanh toán phí đăng tin tuyển dụng",
                "price": "1.0",
                "currency": "USD",
                "quantity": 1
            }];

            var total = 0;
            for (var i = 0; i < items.length; i++) {
                total += parseFloat(items[i].price) * items[i].quantity;
            }

            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": `${process.env.HOST_CLIENT}/employer/job/create`,
                    "cancel_url": `${process.env.HOST_CLIENT}/failure`
                },
                "transactions": [{
                    "item_list": {
                        "items": items
                    },
                    "amount": {
                        "currency": "USD",
                        "total": total.toString()
                    },
                    "description": "Đăng tin tuyển dụng"
                }]
            };

            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    res.json({
                        error: error
                    })
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            res.json({
                                status: 'success',
                                link: payment.links[i].href
                            })
                        }
                    }
                }
            });
        } catch (error) {
            res.json({
                error
            })
        }
    };


    async success(req, res) {
        try {
            const payerId = req.query.PayerID;
            const paymentId = req.query.paymentId;

            const execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": '1'
                    }
                }]
            };

            paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                if (error) {
                    console.log(error)
                    res.json({ error: 'error' });
                } else {
                    res.json({
                        susscess: 'susscess',
                        payment: true
                    });
                }
            });
        } catch (error) {
            res.json({
                error
            })
        }
    };
}
module.exports = new TinTuyenDungController;