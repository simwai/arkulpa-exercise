const mongoose = require('mongoose')
const moment = require('moment')

let Model = null

function asyncDBConnection () {
  const db = mongoose.connection

  return new Promise((resolve, reject) => {
    // db.on('error', console.error.bind(console, 'connection error:'))
    db.on('error', (err) => {
      console.error(err)
      reject(new Error('mongoose connection error'))
    })

    db.once('open', () => {
      // we're connected!
      console.log('connected with mongodb')
      resolve('mongoose connection success')
    })
  })
}

async function init () {
  mongoose.connect('mongodb://localhost:27017/arkulpa-exercise', { useNewUrlParser: true, useUnifiedTopology: true })

  await asyncDBConnection()

  const schema = new mongoose.Schema({
    time: Date,
    district: String,
    official_community_code: Number,
    population: Number,
    patient_amount: Number,
    patient_amount_sum: Number,
    patient_amount_last_seven_days: Number,
    seven_days_incidences: mongoose.Decimal128,
    daily_deaths: Number,
    deaths_sum: Number,
    cured_amount_daily: Number,
    cured_amount_sum: Number
  })

  Model = mongoose.model('model', schema)
}

function importDataFromCSV (data) {
  for (const dataSet of data) {
    console.log(moment(dataSet.Time, 'DD.MM.YYYY hh:mm:ss').toDate())
    const row = new Model({
      time: moment(dataSet.Time, 'DD.MM.YYYY hh:mm:ss').toDate(),
      district: dataSet.Bezirk,
      official_community_code: dataSet.GKZ,
      population: dataSet.AnzEinwohner,
      patient_amount: dataSet.AnzahlFaelle,
      patient_amount_sum: dataSet.AnzahlFaelleSum,
      patient_amount_last_seven_days: dataSet.AnzahlFaelle7Tage,
      seven_days_incidences: dataSet.SiebenTageInzidenzFaelle.replace(',', '.'),
      daily_deaths: dataSet.AnzahlTotTaeglich,
      deaths_sum: dataSet.AnzahlTotSum,
      cured_amount_daily: dataSet.AnzahlGeheiltTaeglich,
      cured_amount_sum: dataSet.AnzahlGeheiltSum
    })

    row.save((err, row) => {
      if (err) return console.error(err)
    })
  }
}

function getData () {
  return Model.find()
}

module.exports = {
  init,
  importDataFromCSV,
  getData
}
