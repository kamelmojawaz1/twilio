const express = require('express')
const smsRouter = express.Router()
const { receiveSms, sendSms } = require('../controllers/smsController')

smsRouter.post('/send/', sendSms)
smsRouter.post('/receive/', receiveSms)
module.exports = smsRouter
