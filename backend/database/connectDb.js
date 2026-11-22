
const connectSequelize = require('./connectSequelize')

const connectDb = async () => {
  await connectSequelize()
}

module.exports = connectDb
