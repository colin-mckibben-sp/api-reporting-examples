import { AccountsApi, Configuration, axiosRetry, Paginator, } from "sailpoint-api-client"

export const getAccounts = async () => {

    let apiConfig = new Configuration()
    let api = new AccountsApi(apiConfig)

    const val = await api.listAccounts()

    return val.data

}

export const getAccountsWithFilters = async () => {

    let apiConfig = new Configuration()
    let api = new AccountsApi(apiConfig)

    let parameters = {
        filters: 'sourceId eq "2c9180887671ff8c01767b4671fb7d5e" and uncorrelated eq false'
    }

    const val = await api.listAccounts(parameters)

    return val.data

}

export const getPaginatedAccounts = async () => {

    let apiConfig = new Configuration()
    let api = new AccountsApi(apiConfig)

    let parameters = {
        filters: 'sourceId eq "2c9180887671ff8c01767b4671fb7d5e" and uncorrelated eq false'
    }

    const val = await Paginator.paginate(api, api.listAccounts, parameters, 10)

    return val.data

}

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