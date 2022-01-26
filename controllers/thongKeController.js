const TaiKhoan = require('../models/taiKhoanModel');
const AppError = require('../utils/appError');

class ThongKeController {
    async soLuong(req, res, next) {
        await TaiKhoan.aggregate([
            {
                $group: {
                    _id: '$loaiTaiKhoan',
                    soLuong: { $sum: 1 }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { loaiTaiKhoan: "$_id", soLuong: '$soLuong' }
                }
            }
        ]).exec().then(datas => {
            let sLNhaTuyenDung, sLUngTuyenVien;
            datas.map(data => {
                if (data.loaiTaiKhoan == 'nhà tuyển dụng') {
                    sLNhaTuyenDung = data.soLuong;
                }
                if (data.loaiTaiKhoan == 'ứng tuyển viên') {
                    sLUngTuyenVien = data.soLuong;
                }
            })

            res.status(200).json({
                status: 'success',
                results: sLUngTuyenVien + sLNhaTuyenDung,
                data: {
                    sLUngTuyenVien,
                    sLNhaTuyenDung
                }
            })
        }).catch(next);
    }
}
module.exports = new ThongKeController;