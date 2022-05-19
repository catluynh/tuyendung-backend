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
        const donUngTuyenTonTai = await DonUngTuyen.findOne({
            ungTuyenVien: req.body.ungTuyenVien,
            tinTuyenDung: req.body.tinTuyenDung
        })
        donUngTuyenMoi.trangThai = Enum.TRANG_THAI_DON.DANG_UNG_TUYEN;
        if (donUngTuyenTonTai) {
            res.status(400).json({
                error: "Bạn đã ứng tuyển tin tuyển dụng này!"
            })
        }
        else {
            await donUngTuyenMoi.save()
                .then((data) => {
                    res.status(201).json({
                        status: 'success',
                        data
                    })
                })
                .catch(next);
        }
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
        console.log(data)
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
        const limit = parseInt(req.query.limit) || 5;
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
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const nhaTuyenDung = await NhaTuyenDung.findById(req.taiKhoan._id);
        //tìm kiếm tin theo nhà tuyển dụng
        await TinTuyenDung.find({ nhaTuyenDung })
            .then(async dsTinTuyenDung => {
                //mảng 2 chiều
                const dsDon = dsTinTuyenDung.map(async tinTuyenDung => {
                    //tìm kiếm đã đơn ứng tuyển theo tin tuyển dụng, array
                    return await DonUngTuyen.find({ tinTuyenDung: tinTuyenDung._id });
                })

                let data = [];
                const dsDonTuyenDung = await Promise.all(dsDon);
                //lấy phần tử trong mảng 2 chiều
                for (var i = 0; i < dsDonTuyenDung.length; i++) {
                    for (var j = 0; j < dsDonTuyenDung[i].length; j++) {
                        data = data.concat([dsDonTuyenDung[i][j]])
                    }
                }

                let trangThai;

                if (req.query.trangThai == 0) {
                    trangThai = 'Thất bại'
                }
                if (req.query.trangThai == 1) {
                    trangThai = 'Đang ứng tuyển'
                }
                if (req.query.trangThai == 2) {
                    trangThai = 'Đã ứng tuyển'
                }


                let allDsDonUngTuyen = data.filter(donUngTuyen => {
                    if (donUngTuyen.trangThai == trangThai) {
                        return donUngTuyen
                    } if (!trangThai) {
                        return donUngTuyen
                    }
                })

                //phân trang
                let dataPage = [];
                if (allDsDonUngTuyen.length - limit > skip) {
                    for (var i = skip; i < (skip + limit); i++) {
                        if (allDsDonUngTuyen[i] != null)
                            dataPage = dataPage.concat([allDsDonUngTuyen[i]]);
                    }
                } else {
                    for (var i = skip; i < data.length; i++) {
                        if (allDsDonUngTuyen[i] != null)
                            dataPage = dataPage.concat([allDsDonUngTuyen[i]]);
                    }
                }

                res.status(200).json({
                    status: 'success',
                    results: dataPage.length,
                    pagination: {
                        page,
                        limit,
                        total: allDsDonUngTuyen.length,
                    },
                    data: dataPage
                })
            })
            .catch(next);
    };

    async timKiemTheoTinTuyenDung(req, res, next) {
        console.log(req.query);
        const page = req.query.page * 1 || 1
        const limit = parseInt(req.query.limit) || 5;
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

    async chapNhanDonUngTuyen(req, res, next) {
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

    async tuChoiDonUngTuyen(req, res, next) {
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

    async donUngTuyenTiemNang(req, res, next) {
        console.log(req.query);
        const page = req.query.page * 1 || 1
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const nhaTuyenDung = await NhaTuyenDung.findById(req.taiKhoan._id);
        //tìm kiếm tin theo nhà tuyển dụng
        await TinTuyenDung.find({ nhaTuyenDung })
            .then(async dsTinTuyenDung => {
                //mảng 2 chiều
                const dsDon = dsTinTuyenDung.map(async tinTuyenDung => {
                    //tìm kiếm đã đơn ứng tuyển theo tin tuyển dụng, array
                    return await DonUngTuyen.find({ tinTuyenDung: tinTuyenDung._id });
                })

                let data = [];
                const dsDonTuyenDung = await Promise.all(dsDon);
                //lấy phần tử trong mảng 2 chiều
                for (var i = 0; i < dsDonTuyenDung.length; i++) {
                    for (var j = 0; j < dsDonTuyenDung[i].length; j++) {
                        data = data.concat([dsDonTuyenDung[i][j]])
                    }
                }

                let allDsDonUngTuyen = data.filter(donUngTuyen => {
                    if (donUngTuyen.tiemNang == true)
                        return donUngTuyen
                })

                //phân trang
                let dataPage = [];
                if (allDsDonUngTuyen.length - limit > skip) {
                    for (var i = skip; i < (skip + limit); i++) {
                        if (allDsDonUngTuyen[i] != null)
                            dataPage = dataPage.concat([allDsDonUngTuyen[i]]);
                    }
                } else {
                    for (var i = skip; i < data.length; i++) {
                        if (allDsDonUngTuyen[i] != null)
                            dataPage = dataPage.concat([allDsDonUngTuyen[i]]);
                    }
                }

                res.status(200).json({
                    status: 'success',
                    results: dataPage.length,
                    pagination: {
                        page,
                        limit,
                        total: allDsDonUngTuyen.length,
                    },
                    data: allDsDonUngTuyen
                })
            })
            .catch(next);

    };

    async themDonUngTuyenTiemNang(req, res, next) {
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

    async huyDonUngTuyenTiemNang(req, res, next) {
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

}
module.exports = new DonUngTuyenController;