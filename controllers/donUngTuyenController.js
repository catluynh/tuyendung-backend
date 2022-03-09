const DonUngTuyen = require('../models/donUngTuyenModel');
const UngTuyenVien = require('../models/ungTuyenVienModel');
const TinTuyenDung = require('../models/tinTuyenDungModel');
const NhaTuyenDung = require('../models/nhaTuyenDungModel');
const Enum = require('../utils/enum');
const AppError = require('../utils/appError');

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
        donUngTuyenMoi.trangThai = Enum.TRANG_THAI_DON.DANG_UNG_TUYEN;
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

    async timKiemTheoUngTuyenVien(req, res, next) {
        console.log(req.query);
        const page = req.query.page * 1 || 1
        const limit = 5;
        const skip = (page - 1) * limit;
        const total = await DonUngTuyen.find({ ungTuyenVien: req.taiKhoan._id }).count();
        await DonUngTuyen.find({ ungTuyenVien: req.taiKhoan._id })
            .limit(limit).skip(skip).exec()
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
    };

    async timKiemTheoNhaTuyenDung(req, res, next) {
        console.log(req.query);
        const page = req.query.page * 1 || 1
        const limit = 5;
        const skip = (page - 1) * limit;
        const nhaTuyenDung = await NhaTuyenDung.findById(req.taiKhoan._id);
        //tìm kiếm tin theo nhà tuyển dụng
        await TinTuyenDung.find({ nhaTuyenDung })
            .then(async datas => {
                //mảng 2 chiều
                const dsDon = datas.map(async data => {
                    //tìm kiếm đã đơn ứng tuyển theo tin tuyển dụng, array
                    return await DonUngTuyen.find({ tinTuyenDung: data._id });
                })

                let data = [];
                const arr = await Promise.all(dsDon);
                //lấy phần tử trong mảng 2 chiều
                for (var i = 0; i < arr.length; i++) {
                    for (var j = 0; j < arr[i].length; j++) {
                        data = data.concat([arr[i][j]])
                    }
                }

                //phân trang
                let dataPage = [];
                if (data.length - limit > skip) {
                    for (var i = skip; i < (skip + limit); i++) {
                        dataPage = dataPage.concat([data[i]]);
                    }
                } else {
                    for (var i = skip; i < data.length; i++) {
                        dataPage = dataPage.concat([data[i]]);
                    }
                }

                res.status(200).json({
                    status: 'success',
                    results: dataPage.length,
                    pagination: {
                        page,
                        limit,
                        total: data.length,
                    },
                    data: dataPage
                })
            })
            .catch(next);
    };

    async timKiemTheoTinTuyenDung(req, res, next) {
        console.log(req.query);
        const page = req.query.page * 1 || 1
        const limit = 5;
        const skip = (page - 1) * limit;
        const total = await DonUngTuyen.find({ tinTuyenDung: req.params.id }).count();
        await DonUngTuyen.find({ tinTuyenDung: req.params.id })
            .limit(limit).skip(skip).exec()
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
    };

    async chapNhaHoSoUngVien(req, res, next) {
        await DonUngTuyen.findById(req.params.id)
            .then(data => {
                data.trangThai = Enum.TRANG_THAI_DON.DA_UNG_TUYEN;
                data.save();
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    };

    async tuChoiHoSoUngVien(req, res, next) {
        await DonUngTuyen.findById(req.params.id)
            .then(data => {
                data.trangThai = Enum.TRANG_THAI_DON.THAT_BAI;
                data.save();
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    };

}
module.exports = new DonUngTuyenController;