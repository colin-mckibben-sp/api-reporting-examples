import { Configuration, Paginator, SearchApi, Search, IdentityDocument } from "sailpoint-api-client"
import * as part1 from './part1'
import fs from 'fs'

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

const main = async () => {
    const data = await part1.getPaginatedAccounts()

    fs.writeFile('output.json', JSON.stringify(data, null, 2), err => {
        if (err) {
            return console.error(err);
        }
        console.log('JSON data is saved.')
    })
}

main()