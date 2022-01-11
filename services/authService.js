const bcrypt = require('bcrypt');

class AuthService{
    async kiemTraMatKhau(matKhau_1, matKhau_2){
        return await bcrypt.compare(matKhau_1, matKhau_2);
    }
}

module.exports = new AuthService;
