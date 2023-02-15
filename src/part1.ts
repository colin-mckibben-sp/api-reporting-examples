import { AccountsApi, Configuration, axiosRetry, Paginator, } from "sailpoint-api-client"

export const getAccounts = async () => {

    let apiConfig = new Configuration()
    apiConfig.retriesConfig = {
        retries: 4,
        retryDelay: axiosRetry.exponentialDelay,
        onRetry(retryCount, error, requestConfig) {
            console.log(`retrying due to request error, try number ${retryCount}`)
        },
    }
    let api = new AccountsApi(apiConfig)

    const val = await api.listAccounts()

    return val.data

}

export const getAccountsWithFilters = async () => {

    let apiConfig = new Configuration()
    apiConfig.retriesConfig = {
        retries: 4,
        retryDelay: axiosRetry.exponentialDelay,
        onRetry(retryCount, error, requestConfig) {
            console.log(`retrying due to request error, try number ${retryCount}`)
        },
    }
    let api = new AccountsApi(apiConfig)

    let parameters = {
        filters: 'sourceId eq "2c9180887671ff8c01767b4671fb7d5e" and uncorrelated eq false'
    }

    const val = await api.listAccounts(parameters)

    return val.data

}

export const getPaginatedAccounts = async () => {

    let apiConfig = new Configuration()
    apiConfig.retriesConfig = {
        retries: 4,
        retryDelay: axiosRetry.exponentialDelay,
        onRetry(retryCount, error, requestConfig) {
            console.log(`retrying due to request error, try number ${retryCount}`)
        },
    }
    let api = new AccountsApi(apiConfig)

    let parameters = {
        limit: 100,
        filters: 'sourceId eq "2c9180887671ff8c01767b4671fb7d5e" and uncorrelated eq false'
    }

    const val = await Paginator.paginate(api, api.listAccounts, parameters, 10)

    return val.data

}