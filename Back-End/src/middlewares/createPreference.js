const express = require("express");
const router = express();
//const cors = require("cors");
const mercadopago = require("mercadopago");

const URL_BACK = process.env.URL_RETURN_FRONT || 'http://localhost:3000'

// require("dotenv").config()
// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN || 'data'
});


// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(express.static("../../client"));
// app.use(cors());

router.post("/", (req, res) => {
    const { items, email } = req.body
    //console.log(items)
    let preference = {
        items: items.map((item) => {
            return {
                id: item.id,
                title: item.description,
                /* description: item.brand,
                 picture_url: item.image,
                 category_id: item.gender,*/
                quantity: item.amount,
                //  currency_id: "COP",
                unit_price: Number(item.pricePerHour),
            };
        }),
        auto_return: "all",
        back_urls: {
            "success": `${URL_BACK}?success=true&em=${email}`,
            "failure": `${URL_BACK}?success=false&em=${email}`,
            "pending": `${URL_BACK}?success=pending`
        }
    };

    mercadopago.preferences.create(preference)
        .then(function (response) {
            console.log(`Created Preference! ${response.body.id}`)
            res.json({
                id: response.body.id
            });
        }).catch(function (error) {
            console.log(error);
        });
});


module.exports = router;