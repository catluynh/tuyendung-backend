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
                        { tinTuyenDung: '$_id', tieuDe: '$tieuDe', ngayHetHan: '$ngayHetHan', soLuongTuyen: '$soLuongDaTuyen' },
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
        await tinTuyenDungMoi.save()
            .then((data) => {
                res.status(201).json({
                    status: 'success',
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
        const page = req.query.page * 1 || 1
        const limit = parseInt(req.query.limit) || 2;
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

        console.log(trangThai);

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
            "trangThai": { $regex: new RegExp(trangThai, "i") },
            "diaDiem.tinhThanhPho": { $regex: new RegExp(req.query.diaDiem, "i") },
            "viTri": { $regex: new RegExp(req.query.viTri, "i") },
            "soNamKinhNghiem": { $regex: new RegExp(req.query.soNamKinhNghiem, "i") },
            "loaiCongViec": { $regex: new RegExp(req.query.loaiCongViec, "i") },
        }).count();

        await TinTuyenDung.find({
            nhaTuyenDung,
            nganhNghe,
            "trangThai": { $regex: new RegExp(trangThai, "i") },
            "diaDiem.tinhThanhPho": { $regex: new RegExp(req.query.diaDiem, "i") },
            "viTri": { $regex: new RegExp(req.query.viTri, "i") },
            "soNamKinhNghiem": { $regex: new RegExp(req.query.soNamKinhNghiem, "i") },
            "loaiCongViec": { $regex: new RegExp(req.query.loaiCongViec, "i") },
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
    }

    async duyetTin(req, res, next) {
        await TinTuyenDung.findById(req.params.id)
            .then(data => {
                data.trangThai = Enum.TRANG_THAI_TIN.DA_DUYET;
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
                data.trangThai = Enum.TRANG_THAI_TIN.KHOA;
                data.save();
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
            { $pull: { dsViecLamDaLuu: { _id: req.body.idViecLamDaLuu } } }
        )
            .then(async () => {
                res.status(201).json({
                    status: 'success'
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
        const limit = parseInt(req.query.limit) || 12;
        await DonUngTuyen.aggregate([
            {
                $group: {
                    _id: '$tinTuyenDung',
                    soLuong: { $sum: 1 }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { idTinTuyenDung: "$_id", soLuong: '$soLuong' }
                }
            }
        ])
            .limit(limit)
            .sort({ 'soLuong': -1 })
            .exec()
            .then(async datas => {
                const dsTin = datas.map(async data => {
                    return await TinTuyenDung.findById(data.idTinTuyenDung);
                })

                res.status(200).json({
                    status: 'success',
                    results: datas.length,
                    data: await Promise.all(dsTin)
                })
            })
            .catch(next);
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
                { $match: { 'trangThai': trangThai } },
                { $count: 'tong' }
            ])

            await TinTuyenDung.aggregate([
                { $lookup: { from: "danhgias", localField: "_id", foreignField: "tinTuyenDung", as: "rs" } },
                { $match: { 'trangThai': trangThai } },
                { $project: { _id: 1, tieuDe: 1, ngayHetHan: 1, 'trangThai': 1, ngayTao: 1, diaDiem: 1, slug: 1, soLuotDanhGia: { $size: "$rs" } } },
                { $skip: skip },
            ]).limit(limit).exec()
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
                { $count: 'tong' }
            ])
            await TinTuyenDung.aggregate([
                { $lookup: { from: "danhgias", localField: "_id", foreignField: "tinTuyenDung", as: "rs" } },
                { $project: { _id: 1, tieuDe: 1, ngayHetHan: 1, 'trangThai': 1, ngayTao: 1, diaDiem: 1, slug: 1, soLuotDanhGia: { $size: "$rs" } } },
                { $skip: skip },
            ]).limit(limit).exec()
                .then(async data => {
                    res.status(201).json({
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

    async tinTuyenDungCoNguyCoKhoa(req, res, next) {
        console.log(req.query);
        const page = req.query.page * 1 || 1
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const total = await TinTuyenDung.aggregate([
            { $lookup: { from: "danhgias", localField: "_id", foreignField: "tinTuyenDung", as: "rs" } },
            { $unwind: "$rs" },
            { $match: { 'rs.xepLoai': { $lt: 3 } } },
            { $count: 'tong' }
        ])

        await TinTuyenDung.aggregate([
            { $lookup: { from: "danhgias", localField: "_id", foreignField: "tinTuyenDung", as: "rs" } },
            { $unwind: "$rs" },
            { $match: { 'rs.xepLoai': { $lt: 3 } } },
            { $skip: skip }
        ]).limit(limit).exec()
            .then(async data => {
                res.status(201).json({
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
    };

    async thanhToan(req, res, next) {
        try {
            const items = [{
                "name": "Thanh toán phí đăng tin tuyển dụng",
                "price": "1.0",
                "currency": "USD",
                "quantity": 2
            }]

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
                    "return_url": "http://localhost:3000/employer/job/create",
                    "cancel_url": "http://localhost:3000/cancel"
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
                    res.render('cancle');
                } else {
                    payment.links.map(link => {
                        if (link.rel === 'approval_url') {
                            open(link.href, function (err) {
                                if (err) throw err;
                            });
                        }
                    })
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
                        "total": "1 USTD"
                    }
                }]
            };

            paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                if (error) {
                    res.render('cancle');
                } else {
                    res.render('success');
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