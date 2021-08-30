require('../env.js')
const axios = require('axios')
//const MessagingResponse = require('twilio').twiml.MessagingResponse

const authToken = process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID
const sender = process.env.TWILIO_PHONE_NUMBER
const myPhoneNumber = process.env.MY_PHONE_NUMBER
const smsServiceUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`

const receiveSms = async (req, res) => {
  try {
    const from = req.body.From
    const body = req.body.Body
    const bodyArray = body.split(' ')
    console.log('in receive sms')
    console.log(`from :${from}`)
    console.log(`code :${bodyArray[0]}`)
    console.log(from === myPhoneNumber)
    console.log(bodyArray[0] === 'sendMsg')

    if (from === myPhoneNumber && bodyArray[0] === 'sendMsg') {
      const to = bodyArray[1]
      const msgBody = bodyArray.splice(0, 2).join(' ')
      await postToTwilio(msgBody, to)
      const twiml = new MessagingResponse()
      twiml.message(`msg has been forwarded to: ${to}`)
      res.writeHead(200, { 'Content-Type': 'text/xml' })
      res.end(twiml)
    } else {
      const msg = `${from} : ${body}`
      await postToTwilio(msg, myPhoneNumber)
      res.writeHead(200, { 'Content-Type': 'text/xml' })
      res.end()
    }
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
    await postToTwilio(message, recipient)
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

const postToTwilio = async (message, recipient) => {
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
}

module.exports = {
  sendSms,
  receiveSms,
}
