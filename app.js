const express = require('express')
const dbHandler = require('./db-handler.js')

const app = express()
const port = 1000

dbHandler.init()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/corona', async (req, res, next) => {
  const data = await dbHandler.getData()
  res.json(data)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
