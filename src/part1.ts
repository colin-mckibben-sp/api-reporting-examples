/* 
Let’s start with a basic use case of exporting uncorrelated accounts in a source to a CSV file.

1. Start with a basic setup of a TypeScript application that has the SDK preinstalled and configured with auth
2. Invoke the accounts API with a simple query.  Demonstrate how to run the program and output to stdout and a file.
3. Filter by source and uncorrelated, and sort by name in ASC order
4. Use pagination to get all records in the query
5. Use typescript class to select which fields to output
6. Convert to CSV
*/

import { AccountsApi, Configuration, Paginator, } from "sailpoint-api-client"

// List all accounts
export const getAccounts = async () => {

    let apiConfig = new Configuration()
    let api = new AccountsApi(apiConfig)

    const val = await api.listAccounts()

    return val.data

}

// Use a query filter to reduce the number of accounts returned
export const getAccountsWithFilters = async () => {

    let apiConfig = new Configuration()
    let api = new AccountsApi(apiConfig)

    let parameters = {
        filters: 'sourceId eq "2c9180887671ff8c01767b4671fb7d5e" and uncorrelated eq false'
    }

    const val = await api.listAccounts(parameters)

    return val.data

}

// Use pagination to get more than 250 accounts
export const getPaginatedAccounts = async () => {

    let apiConfig = new Configuration()
    let api = new AccountsApi(apiConfig)

    let parameters = {
        filters: 'sourceId eq "2c9180887671ff8c01767b4671fb7d5e" and uncorrelated eq false'
    }

    const val = await Paginator.paginate(api, api.listAccounts, parameters, 10)

    return val.data

}

// Only include specific attributes in the final result
export const getPaginatedAccountsWithSelectedFields = async () => {

    let apiConfig = new Configuration()
    let api = new AccountsApi(apiConfig)

    let parameters = {
        filters: 'sourceId eq "2c9180887671ff8c01767b4671fb7d5e" and uncorrelated eq false'
    }

    const val = await Paginator.paginate(api, api.listAccounts, parameters, 10)


    let accounts = val.data.map(account => {
        return {
            name: account.name,
            email: account.attributes!["e-mail"],
            manager: account.attributes!["manager"]
        }
    })

    return accounts

}