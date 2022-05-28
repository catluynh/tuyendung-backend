const UngTuyenVien = require('../models/ungTuyenVienModel');
const AppError = require('../utils/appError');
const uploadHinhAnh = require('../utils/UploadHinhAnh');

class UngTuyenVienController {
    async getAll(req, res, next) {
        const page = req.query.page * 1 || 1
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const total = await UngTuyenVien.find().count();
        await UngTuyenVien.aggregate([
            { $lookup: { from: "taikhoans", localField: "_id", foreignField: "_id", as: "taiKhoan" } },
            //   { $unwind: "$taiKhoan" },
             { $match: { 'taiKhoan.email': 'catluynh99@gmail.com' } },
            // { $sort: { 'taiKhoan.ngayCapNhat': -1 } },
            // { $skip: skip },
            // { $limit: limit },
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
        const ungTuyenVien = await UngTuyenVien.findById(req.taiKhoan._id);
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

    async capNhatKyNang(req, res, next) {
        const kyNang = req.body;
        await UngTuyenVien.updateOne(
            { _id: req.taiKhoan._id, 'dsKyNang._id': kyNang.idKyNang },
            { $set: { 'dsKyNang.$.tenKyNang': kyNang.tenKyNang } }
        )
            .then(async () => {
                res.status(201).json({
                    status: 'success',
                    data: await UngTuyenVien.findById(req.taiKhoan._id)
                })
            })
            .catch(next);
    }

    async themKyNang(req, res, next) {
        const ungTuyenVien = await UngTuyenVien.findById(req.taiKhoan._id);
        const kyNang = { tenKyNang: req.body.tenKyNang };
        ungTuyenVien.dsKyNang.push(kyNang)
        await ungTuyenVien.save()
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    }
    async xoaKyNang(req, res, next) {
        await UngTuyenVien.updateOne(
            { _id: req.taiKhoan._id },
            { $pull: { dsKyNang: { _id: req.body.idKyNang } } }
        )
            .then(async () => {
                res.status(201).json({
                    status: 'success',
                    data: await UngTuyenVien.findById(req.taiKhoan._id)
                })
            })
            .catch(next);
    }

    async capNhatKinhNghiemLamViec(req, res, next) {
        const kinhNghiemLamViec = req.body;
        await UngTuyenVien.updateOne(
            { _id: req.taiKhoan._id, 'dsKinhNghiemLamViec._id': kinhNghiemLamViec.idKinhNghiemLamViec },
            {
                $set: {
                    'dsKinhNghiemLamViec.$.congTy': kinhNghiemLamViec.congTy,
                    'dsKinhNghiemLamViec.$.viTri': kinhNghiemLamViec.viTri,
                    'dsKinhNghiemLamViec.$.moTa': kinhNghiemLamViec.moTa,
                    'dsKinhNghiemLamViec.$.tuNgay': kinhNghiemLamViec.tuNgay,
                    'dsKinhNghiemLamViec.$.denNgay': kinhNghiemLamViec.denNgay,
                }
            }
        )
            .then(async () => {
                res.status(201).json({
                    status: 'success',
                    data: await UngTuyenVien.findById(req.taiKhoan._id)
                })
            })
            .catch(next);
    }

    async themKinhNghiemLamViec(req, res, next) {
        const kinhNghiemLamViec = req.body;
        const ungTuyenVien = await UngTuyenVien.findById(req.taiKhoan._id);
        ungTuyenVien.dsKinhNghiemLamViec.push({
            congTy: kinhNghiemLamViec.congTy,
            viTri: kinhNghiemLamViec.viTri,
            moTa: kinhNghiemLamViec.moTa,
            tuNgay: kinhNghiemLamViec.tuNgay,
            denNgay: kinhNghiemLamViec.denNgay
        })
        await ungTuyenVien.save()
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    }

    async xoaKinhNghiemLamViec(req, res, next) {
        await UngTuyenVien.updateOne(
            { _id: req.taiKhoan._id },
            { $pull: { dsKinhNghiemLamViec: { _id: req.body.idKinhNghiemLamViec } } }
        )
            .then(async () => {
                res.status(201).json({
                    status: 'success',
                    data: await UngTuyenVien.findById(req.taiKhoan._id)
                })
            })
            .catch(next);
    }

    async capNhatChungChi(req, res, next) {
        const chungChi = req.body;
        await UngTuyenVien.updateOne(
            { _id: req.taiKhoan._id, 'dsChungChi._id': chungChi.idChungChi },
            {
                $set: {
                    'dsChungChi.$.tenChungChi': chungChi.tenChungChi,
                    'dsChungChi.$.donViCungCap': chungChi.donViCungCap,
                    'dsChungChi.$.ngayCap': chungChi.ngayCap,
                    'dsChungChi.$.ngayHetHan': chungChi.ngayHetHan,
                }
            }
        )
            .then(async () => {
                res.status(201).json({
                    status: 'success',
                    data: await UngTuyenVien.findById(req.taiKhoan._id)
                })
            })
            .catch(next);
    }

    async themChungChi(req, res, next) {
        const chungChi = req.body;
        const ungTuyenVien = await UngTuyenVien.findById(req.taiKhoan._id);
        ungTuyenVien.dsChungChi.push({
            "tenChungChi": chungChi.tenChungChi,
            "donViCungCap": chungChi.donViCungCap,
            "ngayCap": chungChi.ngayCap,
            "ngayHetHan": chungChi.ngayHetHan,
        })
        await ungTuyenVien.save()
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    }

    async xoaChungChi(req, res, next) {
        await UngTuyenVien.updateOne(
            { _id: req.taiKhoan._id },
            { $pull: { dsChungChi: { _id: req.body.idChungChi } } }
        )
            .then(async () => {
                res.status(201).json({
                    status: 'success',
                    data: await UngTuyenVien.findById(req.taiKhoan._id)
                })
            })
            .catch(next);
    }

    async capNhatHocVan(req, res, next) {
        const hocVan = req.body;
        await UngTuyenVien.updateOne(
            { _id: req.taiKhoan._id, 'dsHocVan._id': hocVan.idHocVan },
            {
                $set: {
                    'dsHocVan.$.donViDaoTao': hocVan.donViDaoTao,
                    'dsHocVan.$.bangCap': hocVan.bangCap,
                    'dsHocVan.$.moTa': hocVan.moTa,
                    'dsHocVan.$.chuyenNganh': hocVan.chuyenNganh,
                    'dsHocVan.$.tuNgay': hocVan.tuNgay,
                    'dsHocVan.$.denNgay': hocVan.denNgay,
                }
            }
        )
            .then(async () => {
                res.status(201).json({
                    status: 'success',
                    data: await UngTuyenVien.findById(req.taiKhoan._id)
                })
            })
            .catch(next);
    }

    async themHocVan(req, res, next) {
        const hocVan = req.body;
        const ungTuyenVien = await UngTuyenVien.findById(req.taiKhoan._id);
        ungTuyenVien.dsHocVan.push({
            "donViDaoTao": hocVan.donViDaoTao,
            "bangCap": hocVan.bangCap,
            "moTa": hocVan.moTa,
            "chuyenNganh": hocVan.chuyenNganh,
            "tuNgay": hocVan.tuNgay,
            "denNgay": hocVan.denNgay
        })
        await ungTuyenVien.save()
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    }

    async xoaHocVan(req, res, next) {
        await UngTuyenVien.updateOne(
            { _id: req.taiKhoan._id },
            { $pull: { dsHocVan: { _id: req.body.idHocVan } } }
        )
            .then(async () => {
                res.status(201).json({
                    status: 'success',
                    data: await UngTuyenVien.findById(req.taiKhoan._id)
                })
            })
            .catch(next);
    }
}

module.exports = new UngTuyenVienController;