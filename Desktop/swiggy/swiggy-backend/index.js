const cors = require('cors')
const express = require("express")

// to do add a stripe key
const stripe = require("stripe")("sk_test_51PxBVhRrxOsiZXUWkSEt1LdD0CpbhU83dzOYlxZ0sadG5eSnZQ17gduBxdM8RrX9jth6vIVMcr2UpvEO4LgcOmr000HN61EGFD")
const { v4:uuid } = require('uuid');

const app = express()

// middleware
app.use(express.json())
app.use(cors())

// routes
app.get("/", (req, res) => {
    res.send("It's working")
})

app.post("/payment", (req, res) => {

    const {product, token} = req.body
    console.log("PRODUCT", product);
    console.log("PRICE", product.price);
    const idempontencykey = uuid()    // so that stripe doesn't charge two times for the same product.

    return stripe.customers.create({
        email: token.email,
        source: token.id,
    }).then((customer) => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: 'purchase of product.name',
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        }, { idempontencykey })
    })
    .then((result) => {
        res.status(200).json(result)
    })
    .catch((err) => {console.log(err);
    })
})

// listen
app.listen(8000, () => console.log("LISTENING AT PORT 8000"));