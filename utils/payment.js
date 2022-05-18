const paypal = require('paypal-rest-sdk');
var open = require('open');
const { success } = require('../controllers/tinTuyenDungController');

paypal.configure({
    'mode': process.env.MODE, //sandbox or live
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
});


function thanhToan() {
    try {
        const items = [{
            "name": "Thanh toán phí đăng tin tuyển dụng",
            "price": "1.0",
            "currency": "USD",
            "quantity": 1
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
                "return_url": "http://localhost:3000/success",
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

        paypal.payment.create(create_payment_json, (error, payment) => {
            if (error) {
                console.log(error);
            } else {
                payment.links.map(link => {
                    if (link.rel === 'approval_url') {
                        open(link.href, function (err) {
                            if (err) throw err;
                        });
                    }
                })
            }
        })
    } catch (error) {
        console.log(error);
    }
}

function thanhCong() {
    try {
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
        console.log(error);
    }
}
module.exports = {
    thanhToan,
    thanhCong
};