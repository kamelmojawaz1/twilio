require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const port = process.env.PORT || 5000
const cors = require('cors')
const smsRouter = require('./routers/smsRouter')

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/v1/sms/', smsRouter)

const start = () => {
  try {
    app.listen(port, () => console.log(`app is listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()
