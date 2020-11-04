const csv = require('csv-parser')
const fs = require('fs')

const dbHandler = require('./db-handler.js')
const results = []

async function main () {
  await dbHandler.init()

  fs.createReadStream('CovidFaelle_Timeline_GKZ.csv')
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
      console.log(results)
      // [
      //   { NAME: 'Daffy Duck', AGE: '24' },
      //   { NAME: 'Bugs Bunny', AGE: '22' }
      // ]t
      dbHandler.importDataFromCSV(results)
    })
}

main()
