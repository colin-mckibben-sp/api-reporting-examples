/*
Not all of our APIs provide adequate filtering options that will fit your needs.  When you find you need to do more filtering on your data, you can utilize your programming language to do the heavy lifting.  In this example, we want to create a report of all of the approved access requests that were granted to a particular identity.

1. Create a request to https://developer.sailpoint.com/idn/api/v3/list-completed-approvals
2. Paginate all results
3. Loop through each result and only keep requests where state=”APPROVED” and requestType=”GRANT_ACCESS”.
4. Output to JSON
*/

import { AccessRequestApprovalsApi, Configuration, Paginator, } from "sailpoint-api-client"

// Get completed approvals with a filter, selecting a subset of the data.
export const completedApprovals = async () => {

    let apiConfig = new Configuration()
    let api = new AccessRequestApprovalsApi(apiConfig)

    const val = await Paginator.paginate(api, api.listCompletedApprovals, undefined, 10)

    let requests = val.data.map(request => {
        return {
            name: request.name,
            created: request.created,
            state: request.state,
            requestType: request.requestType,
            requestedFor: request.requestedFor?.id,
            reviewedBy: request.reviewedBy?.id
        }
    })

    let filteredRequests = requests.filter(request => request.state === "APPROVED" && request.requestType === "GRANT_ACCESS")

    return filteredRequests

}