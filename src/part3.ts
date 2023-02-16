/*
Sometimes, an API response provides reference objects that allow you to find more information by invoking the corresponding endpoint.  In our previous example, we fetched all access requests that were granted and approved.  Now we want to know more about the identity that the access was requested for.  Let’s add that identity’s email address to the report so it’s easier to contact them.

1. Build off of the previous example.  
2. Loop through each filtered request and make an API call to https://developer.sailpoint.com/idn/api/v3/public-identities using the id filter.  Convert the reviewedBy from an object to an email address.  Output to CSV.

Expanding data in this way can be very expensive, and will likely lead to rate limiting.  To avoid being rate limited, try to cache data when possible.  One caching method is as follows:

1. Loop through all of your results once to build a set of objects that you need to de-reference.  In this case, it’s our approver ID’s.  Use a set data structure when possible, which guarantees each item in the set is unique.  We don’t want to make duplicate API calls.
2. Loop through your approver ID list and make an API call for each one to get their details.
3. Loop through your initial result set again, this time using your cached data to fill in the details.
*/

import { AccessRequestApprovalsApi, ApprovalScheme, AxiosResponse, axiosRetry, Configuration, Paginator, PublicIdentitiesApi, PublicIdentity, } from "sailpoint-api-client"
import * as part2 from './part2'

// Get completed approvals with the email address instead of identity id.  This one is inefficient.
export const completedApprovalsWithEmail = async () => {

    // Add retry logic since we will asynchronously execute API calls to get identity email addresses.
    // This could result in rate limiting.
    let apiConfig = new Configuration()
    apiConfig.retriesConfig = {
        retries: 4,
        retryDelay: axiosRetry.exponentialDelay,
        onRetry(retryCount, error, requestConfig) {
            console.log(`retrying due to request error, try number ${retryCount}`)
        },
    }
    let api = new PublicIdentitiesApi(apiConfig)

    const approvals = await part2.completedApprovals()

    const approvalsWithEmail = approvals.map(async approval => {
        let parameters = {
            filters: `id eq "${approval.reviewedBy}"`
        }
        const response = await api.getPublicIdentities(parameters)

        let identity = response.data[0]

        approval.reviewedBy = identity.email!

        return approval
    })

    return Promise.all(approvalsWithEmail)

}

// Deduplicate reviewers to save on total number of network requests.
export const completedApprovalsWithEmailEfficient = async () => {

    // Add retry logic since we will asynchronously execute API calls to get identity email addresses.
    // This could result in rate limiting.
    let apiConfig = new Configuration()
    apiConfig.retriesConfig = {
        retries: 4,
        retryDelay: axiosRetry.exponentialDelay,
        onRetry(retryCount, error, requestConfig) {
            console.log(`retrying due to request error, try number ${retryCount}`)
        },
    }
    let api = new PublicIdentitiesApi(apiConfig)

    const approvals = await part2.completedApprovals()

    // Build a map of unique reviewedBy identities
    const identities = new Map<string, string>()
    approvals.forEach(approval => {
        identities.set(approval.reviewedBy!, "")
    })

    // Resolve the email address for each unique identity
    const identityEmailRequests: Promise<AxiosResponse<PublicIdentity[], any>>[] = []
    identities.forEach((email, identity) => {
        let parameters = {
            filters: `id eq "${identity}"`
        }
        identityEmailRequests.push(api.getPublicIdentities(parameters))
    })

    const results = await Promise.all(identityEmailRequests)
    results.forEach(result => {
        identities.set(result.data[0].id!, result.data[0].email!)
    })

    // replace the reviewedBy identity ID with the email address
    return approvals.map(approval => {
        approval.reviewedBy = identities.get(approval.reviewedBy!)
        return approval
    })

}