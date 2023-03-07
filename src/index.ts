import * as part1 from './part1'
import * as part2 from './part2'
import * as part3 from './part3'
import * as part4 from './part4'
import fs from 'fs'
import { json2csvAsync } from 'json-2-csv';

const writeJSON = async (data: any) => {

    let json = JSON.stringify(data, null, 2)

    fs.writeFile('output.json', json, err => {
        if (err) {
            return console.error(err);
        }
        console.log('JSON data is saved.')
    })
}

const writeCSV = async (data: any) => {

    let csv = await json2csvAsync(data)

    fs.writeFile('output.csv', csv, err => {
        if (err) {
            return console.error(err);
        }
        console.log('CSV data is saved.')
    })
}

const main = async () => {
    const data = await part1.getSearch()

    await writeJSON(data)
}

main()