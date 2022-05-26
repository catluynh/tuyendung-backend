const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const TaiKhoan = require('../models/taiKhoanModel');
const AppError = require('../utils/appError');
const guiEmail = require('../utils/email');
const crypto = require('crypto');
const UngTuyenVien = require('../models/ungTuyenVienModel');
const NhaTuyenDung = require('../models/nhaTuyenDungModel');

const createToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

class AuthController {
    async dangNhap(req, res, next) {
        try {
            const tenDangNhap = req.body.tenDangNhap;
            const matKhau = req.body.matKhau;

            //Kiểm tra nếu tồn tại tên đăng nhập và mật khẩu
            if (!tenDangNhap || !matKhau) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Tài khoản và mật khẩu không được để trống',
                });
            }

            //Kiểm tra nếu tồn tại tài khoản 
            const taiKhoan = await TaiKhoan.findOne({ tenDangNhap }).select('+matKhau');
            if (!taiKhoan || !(await taiKhoan.kiemTraMatKhau(matKhau, taiKhoan.matKhau))) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Tài khoản hoặc mật khẩu không đúng',
                });
            }

            //Kiểm tra tài khoàn bị khóa
            if (taiKhoan.trangThai === false) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Tài khoản đã bị khóa',
                });
            }

            //Kiểm tra tài khoàn bị khóa
            if (taiKhoan.xacThucTaiKhoan === false) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Tài khoản chưa xác thực. Vui lòng truy cập vào email của bạn để xác thực.',
                });
            }

            // gửi data, token cho client
            const token = createToken(taiKhoan._id);
            taiKhoan.matKhau = undefined;
            // thời gian hết hạn của token
            const exp = jwt.verify(token, process.env.JWT_SECRET).exp;
            res.status(200).json({
                status: 'success', token, expToken: exp, taiKhoan: taiKhoan
            });
        } catch (error) {
            return next();
        }
    }

    async dangKi(req, res, next) {
        try {
            // kiểm tra email đã tồn tại
            if (await TaiKhoan.findOne({ 'email': req.body.email })) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Email đã tồn tại',
                });
            }

            //kiểm tra tên tài khoản đã tồn tại
            if (await TaiKhoan.findOne({ 'tenDangNhap': req.body.tenDangNhap })) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Tên tài khoản đã tồn tại',
                });
            }

            const taiKhoanMoi = await TaiKhoan.create(req.body);

            const taiKhoan = await TaiKhoan.findOne({ 'email': taiKhoanMoi.email });

            // Tạo token ngẫu nhiên
            const randomToken = taiKhoan.randomToken();
            await taiKhoan.save({ validateBeforeSave: false });

            // Gửi email 
            const formURL = `${req.protocol}://${req.get('host')}/auth/xacThucTaiKhoan/${randomToken}`;
            const message = `Cảm ơn đã đăng kí tài khoản. Email này có hiệu lực trong vòng 10 phút. Click vào đây để xác thực tài khoản: ${formURL}`;

            await guiEmail({
                email: taiKhoan.email,
                subject: 'Xác thực tài khoản',
                message,
            });

            //Không hiện mật khẩu
            taiKhoan.matKhau = undefined;
            taiKhoan.yeuCauKichHoat = undefined;

            res.status(201).json({
                status: 'success',
                //token,
                taiKhoan: taiKhoan
            })
        } catch (error) {
            return res.status(400).json({
                message: error,
            });
        }
    }

    async xacThucTaiKhoan(req, res, next) {
        try {
            // xác thực token (băm token)
            const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

            //tìm tài khoản kích hoạt
            const taiKhoan = await TaiKhoan.findOne({
                'yeuCauKichHoat.maKichHoat': hashedToken,
                'yeuCauKichHoat.thoiGianMaKichHoat': { $gt: Date.now() } // >
            });

            if (!taiKhoan) {
                console.log(taiKhoan)
                //nếu tài khoản hết hạn => xóa => tạo lại 
                const taiKhoanHetHan = await TaiKhoan.findOne({
                    'yeuCauKichHoat.maKichHoat': hashedToken,
                    'yeuCauKichHoat.thoiGianMaKichHoat': { $lte: Date.now() } //<=
                });
                if (taiKhoanHetHan) {
                    await TaiKhoan.findByIdAndDelete(taiKhoanHetHan._id);
                }
                return res.status(403).json({
                    status: 'error',
                    message: 'Token đã hết hạn. Vui lòng tạo lại tài khoản',
                });
            }

            if (taiKhoan.loaiTaiKhoan == 'ung_tuyen_vien') {
                taiKhoan.xacThucTaiKhoan = true;
                taiKhoan.yeuCauKichHoat = undefined;
                await taiKhoan.save();

                //Tạo ứng tuyển viên
                const object = { _id: "", };
                const ungTuyenVienMoi = new UngTuyenVien(object);
                ungTuyenVienMoi._id = taiKhoan._id;
                ungTuyenVienMoi.taiKhoan = taiKhoan._id
                await ungTuyenVienMoi.save();

                res.redirect(`${process.env.HOST_CLIENT}/auth/register/verified`);
            }
            if (taiKhoan.loaiTaiKhoan == 'nha_tuyen_dung') {
                taiKhoan.xacThucTaiKhoan = true;
                taiKhoan.yeuCauKichHoat = undefined;
                await taiKhoan.save();

                //Tạo ứng tuyển viên
                const object = { _id: "", };
                const nhaTuyenDungMoi = new NhaTuyenDung(object);
                nhaTuyenDungMoi._id = taiKhoan._id;
                nhaTuyenDungMoi.taiKhoan = taiKhoan._id
                await nhaTuyenDungMoi.save();

                res.redirect(`${process.env.HOST_CLIENT}/auth/register/form`);
            }

        } catch (error) {
            return res.status(500).json({
                message: error,
            });
        }
    }

    async protect(req, res, next) {
        try {
            let token;
            // Kiểm tra token và lấy token
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
            }
            if (!token) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Vui lòng đăng nhập lại.',
                });
            }
            // Xác minh token
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

            // 3) Kiểm tra đăng nhập
            const taiKhoanHienTai = await TaiKhoan.findById(decoded.id);
            if (!taiKhoanHienTai) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Vui lòng đăng nhập.',
                });
            }

            // Kiểm tra tài khoản đã thay đổi mật khẩu sau khi token đc cấp
            // if (currentUser.changedPasswordAfter(decoded.iat)) {
            //     return next(
            //         new AppError(`User recently changed password! Please login again`, 401)
            //     );
            // }
            req.taiKhoan = taiKhoanHienTai;
            next();
        } catch (error) {
            return res.status(500).json({
                message: error,
            });
        }
    }

    async doiMatKhau(req, res, next) {
        try {
            const taiKhoan = await TaiKhoan.findById(req.taiKhoan._id).select('+matKhau');
            //Kiểm tra mật khẩu
            if (!(await taiKhoan.kiemTraMatKhau(req.body.matKhauHienTai, taiKhoan.matKhau))) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Bạn nhập sai mật khẩu hiện tại',
                });
            }

            //kiểm tra mật khẩu đổi trùng với mật khẩu hiện tại
            if ((await taiKhoan.kiemTraMatKhau(req.body.matKhau, taiKhoan.matKhau))) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Mật khẩu trùng với mật khẩu hiện tại',
                });
            }

            taiKhoan.matKhau = req.body.matKhau;
            taiKhoan.xacNhanMatKhau = req.body.xacNhanMatKhau;
            await taiKhoan.save();

            const token = createToken(taiKhoan._id);
            res.status(201).json({
                status: 'success',
                token,
                taiKhoan
            })
        } catch (error) {
            return res.status(500).json({
                message: error,
            });
        }

    }

    async quenMatKhau(req, res, next) {
        const taiKhoan = await TaiKhoan.findOne({ 'email': req.body.email });
        try {
            if (!taiKhoan) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Email không tồn tại',
                });
            }

            // Tạo random token
            const randomToken = taiKhoan.randomToken();
            await taiKhoan.save({ validateBeforeSave: false });

            // Gửi email 
            const formURL = `${req.protocol}://${req.get('host')}/auth/showFormQuenMatKhau/${randomToken}`;
            const message = `Email này có hiệu lực trong vòng 10 phút. Click vào đây để đặt lại mật khẩu: ${formURL}`;

            await guiEmail({
                email: taiKhoan.email,
                subject: 'Tạo mới mật khẩu',
                message,
            });
            res.status(200).json({
                status: 'success',
                message: 'Vui lòng kiểm tra email để đặt lại mật khẩu',
                token: randomToken
            });
        } catch (error) {
            taiKhoan.yeuCauKichHoat = undefined;
            return res.status(500).json({
                message: error,
            });
        }
    }

    async showFormQuenMatKhau(req, res, next) {
        try {
            // xác thực token (băm token)
            const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

            //tìm tài khoản kích hoạt >
            const taiKhoan = await TaiKhoan.findOne({
                'yeuCauKichHoat.maKichHoat': hashedToken,
                'yeuCauKichHoat.thoiGianMaKichHoat': { $gt: Date.now() }
            })

            if (!taiKhoan) {
                // tài khoản hết hạn
                const taiKhoanHetHan = await TaiKhoan.findOne({
                    'yeuCauKichHoat.maKichHoat': hashedToken,
                    'yeuCauKichHoat.thoiGianMaKichHoat': { $lte: Date.now() } // <=
                });
                if (taiKhoanHetHan) {
                    taiKhoanHetHan.yeuCauKichHoat = undefined;
                    await taiKhoanHetHan.save();
                }
                return res.status(401).json({
                    status: 'error',
                    message: 'Đương dẫn đã hết hạn',
                });
            }
            res.redirect(`${process.env.HOST_CLIENT}/auth/verified/${req.params.token}`);
            // res.status(201).json({
            //     status: 'success',
            //     token: req.params.token
            // })
        } catch (error) {
            return res.status(500).json({
                message: error,
            });
        }
    }

    async datLaiMatKhau(req, res, next) {
        try {
            // xác thực token (băm token)
            const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

            //tìm tài khoản thay đổi mật khẩu theo token và ngày hết hạn token > ngày giờ hiện tại
            const taiKhoan = await TaiKhoan.findOne({
                'yeuCauKichHoat.maKichHoat': hashedToken,
                'yeuCauKichHoat.thoiGianMaKichHoat': { $gt: Date.now() }
            });

            if (!taiKhoan) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Token đã hết hạn',
                });
            }
            taiKhoan.matKhau = req.body.matKhau;
            taiKhoan.xacNhanMatKhau = req.body.xacNhanMatKhau;
            taiKhoan.yeuCauKichHoat = undefined;
            await taiKhoan.save();

            const token = createToken(taiKhoan._id);
            res.status(201).json({
                status: 'success',
                token,
                taiKhoan
            })
        } catch (error) {
            return res.status(500).json({
                message: error,
            });
        }
    }

    kiemTraLoaiTaiKhoan(loaiTaiKhoan) {
        try {
            return (req, res, next) => {
                if (!loaiTaiKhoan.includes(req.taiKhoan.loaiTaiKhoan)) {
                    return res.status(403).json({
                        status: 'error',
                        message: 'Bạn không có quyền truy cập',
                    });
                }
                next();
            }
        } catch (error) {
            return res.status(500).json({
                message: error,
            });
        }
    }
}

module.exports = new AuthController;