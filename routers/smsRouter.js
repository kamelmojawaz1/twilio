const express = require('express')
const smsRouter = express.Router()
const { receiveSms, sendSms } = require('../controllers/smsController')

smsRouter.post('/', sendSms)
smsRouter.get('/', receiveSms)
module.exports = smsRouter
