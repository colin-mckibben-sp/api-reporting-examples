## Prerequisites:
- VSCode
- Node.js and NPM
- TypeScript
- SailPoint SDK


## Setup

Before we can begin, we need to initialize our project.

`npm install`

Configure secrets.  Please see the typescript sdk for more information.

## Part 1: Accounts API

This section starts with a basic use case of exporting uncorrelated accounts in a source to a CSV file.

## Part 2: Using Language Features to Provide More Filtering Options

Not all of our APIs provide adequate filtering options that will fit your needs.  When you find you need to do more filtering on your data, you can utilize your programming language to do the heavy lifting.  In this example, we want to create a report of all of the approved access requests that were granted to a particular identity.

## Part 3: Expanding Data with Multiple API Calls (6 minutes)

Sometimes, an API response provides reference objects that allow you to find more information by invoking the corresponding endpoint.  In our previous example, we fetched all access requests that were granted and approved.  Now we want to know more about the identity that the access was requested for.  Let’s add that identity’s email address to the report so it’s easier to contact them.

## Part 4: Search API

The Search feature in the IDN UI uses the Search API.  However, the UI doesn’t offer the full scope of features and data that the API can provide.  The Search API is a powerful reporting tool, with many features not available in our standard APIs.  Many of the concepts that I showed you in this session can also be applied to search.  For this demonstration, I’m going to show you how to craft complex search queries in Postman, which can then be utilized in a script to automate reports.

### Include/Exclude fields

Save network bandwidth and processing power by only asking for the fields you need to process.

```json
{
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
```

### Inner Hit

Perform queries on nested data, returning just the nested data objects that match the query.  The outer query acts as a filter, reducing the objects that the innerhit will need to work with.  For example, return the combined entitlements for employees of a single manager, which can be used to see if a particular team has entitlements that fall outside of the scope of their work.

```json
{
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
```

### Aggregation

Summarize data as metrics, statistics, or other analytics, such as averages, counts, etc.  For example, this query can aggregate identities to find identities that have duplicate accounts on the same source.

```json
{
 "query": {
"query": "*"
 },
"indices": [
"identities"
 ],
"aggregationsDsl": {
"accounts": {
"nested": {
"path": "accounts"
 },
"aggs": {
"source_id": {
"terms": {
"field": "accounts.source.id",
"min_doc_count": 2,
"size": 1000
 },
"aggs": {
"identities": {
"terms": {
"field": "_id",
"min_doc_count": 2
 },
"aggs": {
"accounts": {
"top_hits": {}
 }
 }
 }
 }
 }
 }
 }
 }
}
```

