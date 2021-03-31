const functions = require("firebase-functions");
const stripe = require("stripe")('sk_test_mE4xz3ZtUmOaKu4Gyx8jwaQ8');
exports.payWithStripe = functions.https.onRequest((request, response) => {
    stripe.charges.create({
        amount: request.body.amount,
        currency: request.body.currency,
        source: 'tok_mastercard',
    }).then((charge) => {
        response.send(charge);
    }).catch(er => {
        console.log(er);
    });
},);
