import { Configuration, SearchApi, SearchApiSearchPostRequest } from "sailpoint-api-client"


export const includeExcludeSearch = async () => {

    let apiConfig = new Configuration()
    let api = new SearchApi(apiConfig)

    let requestBody: SearchApiSearchPostRequest = {
        search: {
            "indices": [
                "identities"
            ],
            "query": {
                "query": "name:colin.mckibben"
            },
            "queryResultFilter": {
                "includes": [
                    "id",
                    "name",
                    "status"
                ]
            }
        }
    }

    const results = await api.searchPost(requestBody)

    return results.data

}

export const innerHitSearch = async () => {

    let apiConfig = new Configuration()
    let api = new SearchApi(apiConfig)

    let requestBody: SearchApiSearchPostRequest = {
        search: {
            "indices": [
                "identities"
            ],
            "query": {
                "query": "manager.id:2c9180867dfe694b017e208e26565795",
                "innerHit": {
                    "type": "access",
                    "query": "type:ENTITLEMENT"
                }
            }
        }
    }

    const results = await api.searchPost(requestBody)

    return results.data

}