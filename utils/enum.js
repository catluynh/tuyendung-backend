const LOAI_TAI_KHOAN = {
  UNG_TUYEN_VIEN: 'ung_tuyen_vien',
  NHA_TUYEN_DUNG: 'nha_tuyen_dung',
  QUAN_TRI_VIEN: 'quan_tri_vien'
};

const XEP_LOAI = {
  MOT_SAO: 1,
  HAI_SAO: 2,
  BA_SAO: 3,
  BON_SAO: 4,
  NAM_SAO: 5,
};

const SO_NAM_KINH_NGHIEM = {
  CHUA_CO_KINH_NGHIEM: 'Chưa có kinh nghiệm',
  DUOI_MOT_NAM: 'Dưới 1 năm',
  MOT_NAM: '1 năm',
  HAI_NAM: '2 năm',
  BA_NAM: '3 năm',
  BON_NAM: '4 năm',
  NAM_NAM: '5 năm',
  TREN_NAM_NAM: 'Trên 5 năm'
}

const LOAI_CONG_VIEC = {
  TOAN_THOI_GIAN: 'Toàn thời gian',
  BAN_THOI_GIAN: 'Bán thời gian',
  THUC_TAP: 'Thực tập sinh',
  THOI_VU: 'Thời vụ',
  HOP_DONG: 'Hợp đồng',
  KHAC: 'Khác'
}

const VI_TRI = {
  SINH_VIEN: 'Sinh viên',
  THUC_TAP: 'Thực tập',
  MOI_TOT_NGHIEP: 'Mới tốt nghiệp',
  NHAN_VIEN: 'Nhân viên',
  TRUONG_PHONG: 'Trưởng phòng',
  GIAM_SAT: 'Giám sát',
  QUAN_LY: 'Quản lý',
  PHO_GIAM_DOC: 'Phó giám đốc',
  KHAC: 'Khác'
}

const BANG_CAP = {
  TRUNG_HOC: 'Trung học',
  TRUNG_CAP: 'Trung cấp',
  CAO_DANG: 'Cao Đẳng',
  DAI_HOC: 'Đại học',
  SAU_DAI_HOC: 'Sau đại học',
  NGHE: 'Nghề',
  CHUA_TOT_NGHIEP: 'Chưa tốt nghiệp',
  PHO_THONG: 'Phổ thông',
  KHAC: 'Khác'
}

const TRANG_THAI_TIN = {
  DA_DUYET: 'Đã duyệt',
  CHO_DUYET: 'Chờ duyệt',
  DUNG_TUYEN: 'Dừng tuyển',
  KHOA: 'Khóa',
  TU_CHOI: 'Từ chối'
}

const TRANG_THAI_DON = {
  DANG_UNG_TUYEN: 'Đang ứng tuyển',
  DA_UNG_TUYEN: 'Đã ứng tuyển',
  THAT_BAI: 'Thất bại'
}

module.exports = {
  XEP_LOAI,
  LOAI_TAI_KHOAN,
  SO_NAM_KINH_NGHIEM,
  LOAI_CONG_VIEC,
  VI_TRI,
  BANG_CAP,
  TRANG_THAI_TIN,
  TRANG_THAI_DON
};
