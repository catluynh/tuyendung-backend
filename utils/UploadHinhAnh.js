const AWS = require('aws-sdk');

const S3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
})

function luuDSHinhAnh(dsHinhAnh, uuid) {
    if (dsHinhAnh.length > 1) {
        luuS3(dsHinhAnh, uuid);
        return dsHinhAnh;
    } else {
        let hinhAnh = [dsHinhAnh];
        luuS3(hinhAnh, uuid);
        return hinhAnh;
    }
}

function luuS3(dsHinhAnh, uuid) {
    try {
        dsHinhAnh.forEach((hinhAnh) => {
            const params = {
                Bucket: process.env.AWSBUCKETNAME,
                Key: `${hinhAnh.name}`,
                Body: hinhAnh.data, //(buffer file)
                ACL: 'public-read',
                ContentType: hinhAnh.mimetype
            }
            S3.upload(params, (error, data) => {
                if (error) console.log(error);
                return data;
            });
        });
    } catch (error) {
        console.log(error);
    }
}

function xoaHinhAnh(tenHinhAnh) {
    try {
        const params = {
            Bucket: process.env.AWSBUCKETNAME,
            Key: tenHinhAnh
        }
        S3.deleteObject(params, function (err, data) {
            if (err) console.log(err);
            else data;
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    luuDSHinhAnh: luuDSHinhAnh,
    xoaHinhAnh: xoaHinhAnh
};