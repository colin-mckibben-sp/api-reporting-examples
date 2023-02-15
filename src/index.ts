import { Configuration, Paginator, SearchApi, Search, IdentityDocument } from "sailpoint-api-client"
import * as part1 from './part1'
import fs from 'fs'
import { json2csv, json2csvAsync } from 'json-2-csv';

const search = async () => {
    let apiConfig = new Configuration()
    let api = new SearchApi(apiConfig)
    let search: Search = {
        indices: [
            "identities"
        ],
        query: {
            query: "*"
        },
        sort: ["-name"]
    }
    const val = await Paginator.paginateSearchApi(api, search, 10, 1000)

    for (const result of val.data) {
        const castedResult: IdentityDocument = result
        console.log(castedResult.name)
    }

}

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
    const data = await part1.getPaginatedAccountsWithSelectedFields()

    await writeCSV(data)
}

main()