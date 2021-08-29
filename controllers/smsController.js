require('../env.js')
const axios = require('axios')
const MessagingResponse = require('twilio').twiml.MessagingResponse

const authToken = process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID
const sender = process.env.TWILIO_PHONE_NUMBER
const smsServiceUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`

const receiveSms = async (req, res) => {
  try {
    const twiml = new MessagingResponse()
    twiml.message('The Robots are coming! Head for the hills!')
    res.writeHead(200, { 'Content-Type': 'text/xml' })
    res.end(twiml.toString())
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    })
  }
}

const sendSms = async (req, res) => {
  try {
    const { message, recipient } = req.body
    const data = {
      Body: message,
      From: sender,
      To: recipient,
    }
    const encodedData = Object.keys(data)
      .map(key => `${key}=${encodeURIComponent(data[key])}`)
      .join('&')
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: accountSid,
        password: authToken,
      },
    }
    await axios.post(smsServiceUrl, encodedData, options)
    return res.status(500).json({
      success: true,
      message: message,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    })
  }
}

module.exports = {
  sendSms,
  receiveSms,
}
