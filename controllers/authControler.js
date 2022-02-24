const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const TaiKhoan = require('../models/taiKhoanModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

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
                return next(new AppError('Tài khoản và mật khẩu không được để trống', 400));
            }

            //Kiểm tra nếu tồn tại tài khoản 
            const taiKhoan = await TaiKhoan.findOne({ tenDangNhap }).select('+matKhau');
            if (!taiKhoan || !(await taiKhoan.kiemTraMatKhau(matKhau, taiKhoan.matKhau))) {
                return next(new AppError('Tài khoản hoặc mật khẩu không đúng', 401));
            }

            //Kiểm tra tài khoàn bị khóa
            if (taiKhoan.trangThai === false) {
                return next(new AppError('Tài khoản đã bị khóa', 401));
            }

            //Kiểm tra tài khoàn bị khóa
            if (taiKhoan.xacThucTaiKhoan === false) {
                return next(new AppError('Tài khoản chưa xác thực. Vui lòng truy cập vào email của bạn để xác thực.', 401));
            }

            // gửi data, token cho client
            const token = createToken(taiKhoan._id);
            taiKhoan.matKhau = undefined;
            res.status(200).json({
                status: 'success', token, taiKhoan: taiKhoan
            });
        } catch (error) {
            return next();
        }
    }

    async dangKi(req, res, next) {
        try {
            const taiKhoanMoi = await TaiKhoan.create(req.body);

            const taiKhoan = await TaiKhoan.findOne({ 'email': taiKhoanMoi.email });

            // Tạo random token
            const randomToken = taiKhoan.randomToken();
            await taiKhoan.save({ validateBeforeSave: false });

            // Gửi email 
            const formURL = `${req.protocol}://${req.get('host')}/auth/xacThucTaiKhoan/${randomToken}`;
            const message = `Cảm ơn đã đăng kí tài khoản. Click vào đây để xác thực tài khoản: ${formURL}`;

            await sendEmail({
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
            return next(new AppError('Tài khoản đã tồn tại', 401));
        }
    }

    async xacThucTaiKhoan(req, res, next) {
        try {
            // xác thực token (băm token)
            const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

            //tìm tài khoản kích hoạt
            const taiKhoan = await TaiKhoan.findOne({
                'yeuCauKichHoat.maKichHoat': hashedToken,
                'yeuCauKichHoat.thoiGianMaKichHoat': { $gt: Date.now() }
            });

            //nếu tài khoản hết hạn => xóa => tạo lại 
            if (!taiKhoan) {
                const taiKhoanHetHan = await TaiKhoan.findOne({
                    'yeuCauKichHoat.maKichHoat': hashedToken,
                    'yeuCauKichHoat.thoiGianMaKichHoat': { $lte: Date.now() }
                });
                await TaiKhoan.findByIdAndDelete(taiKhoanHetHan._id);
                return next(new AppError('Token đã hết hạn. Vui lòng tạo lại tài khoản', 401));
            }
            taiKhoan.xacThucTaiKhoan = true;
            taiKhoan.yeuCauKichHoat = undefined;

            await taiKhoan.save();


            const token = createToken(taiKhoan._id);
            res.status(201).json({
                status: 'success',
                token,
                taiKhoan: taiKhoan
            })
        } catch (error) {
            return next(error);
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
                return next(new AppError('Vui lòng đăng nhập 😫', 401));
            }
            // Xác minh token
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

            // 3) Kiểm tra đăng nhập
            const taiKhoanHienTai = await TaiKhoan.findById(decoded.id);
            if (!taiKhoanHienTai) {
                return next(new AppError('Vui lòng đăng nhập 😫', 401));
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
            next(new AppError('Hết phiên đăng nhâp. Vui lòng đăng nhập', 401));
        }
    }

    async doiMatKhau(req, res, next) {
        try {
            const taiKhoan = await TaiKhoan.findById(req.taiKhoan._id).select('+matKhau');

            //Kiểm tra mật khẩu
            if (!(await taiKhoan.kiemTraMatKhau(req.body.matKhauHienTai, taiKhoan.matKhau))) {
                return next(new AppError('Bạn nhập sai mật khẩu hiện tại', 401));
            }

            if ((await taiKhoan.kiemTraMatKhau(req.body.matKhau, taiKhoan.matKhau))) {
                return next(new AppError('Mật khẩu trùng với mật khẩu hiện tại', 401));
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
            next(error)
        }

    }

    async quenMatKhau(req, res, next) {
        const taiKhoan = await TaiKhoan.findOne({ 'email': req.body.email });
        try {
            if (!taiKhoan) {
                return next(new AppError('Email không tồn tại'));
            }

            // Tạo random token
            const randomToken = taiKhoan.randomToken();
            await taiKhoan.save({ validateBeforeSave: false });

            // Gửi email 
            const formURL = `${req.protocol}://${req.get('host')}/auth/showFormQuenMatKhau/${randomToken}`;
            const message = `Click vào đây để đặt lại mật khẩu: ${formURL}`;

            await sendEmail({
                email: taiKhoan.email,
                subject: 'Tạo mới mật khẩu',
                message,
            });
            res.status(200).json({
                status: 'success',
                message: 'Vui lòng kiểm tra email để đặt lại mật khẩu',
            });
        } catch (error) {
            taiKhoan.yeuCauKichHoat.maKichHoat = undefined;
            taiKhoan.yeuCauKichHoat.thoiGianMaKichHoat = undefined;
            return next(new AppError('Lỗi. Vui lòng thử lại sau'), 500);
        }
    }

    showFormQuenMatKhau(req, res, next) {
        res.status(201).json({
            status: 'success',
            token: req.params.token
        })
    }

    async datLaiMatKhau(req, res, next) {
        // xác thực token (băm token)
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        //tìm tài khoản thay đổi mật khẩu theo token và ngày hết hạn token > ngày giờ hiện tại
        const taiKhoan = await TaiKhoan.findOne({
            'yeuCauKichHoat.maKichHoat': hashedToken,
            'yeuCauKichHoat.thoiGianMaKichHoat': { $gt: Date.now() }
        });

        if (!taiKhoan) {
            return next(new AppError('Token đã hết hạn', 401));
        }
        taiKhoan.matKhau = req.body.matKhau;
        taiKhoan.xacNhanMatKhau = req.body.xacNhanMatKhau;
        taiKhoan.yeuCauKichHoat.maKichHoat = undefined;
        taiKhoan.yeuCauKichHoat.thoiGianMaKichHoat = undefined;
        await taiKhoan.save();

        const token = createToken(taiKhoan._id);
        res.status(201).json({
            status: 'success',
            token,
            taiKhoan
        })
    }

    kiemTraLoaiTaiKhoan(loaiTaiKhoan) {
        try {
            return (req, res, next) => {
                if (!loaiTaiKhoan.includes(req.taiKhoan.loaiTaiKhoan)) {
                    return next(new AppError('Bạn không có quyền truy cập', 403));
                }
                next();
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController;