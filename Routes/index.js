const express = require('express')
const { GetTransactionByAddress} = require('../Controllers/GetTransactionByAddress')
const router = new express.Router()


router.get('/transactions/gettransactionbywalletaddress/:walletAddress',GetTransactionByAddress)

module.exports = router;