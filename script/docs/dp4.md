# Company Endpoints

## **Company Dataset API**

**Overview:** The Company Dataset API allows users to retrieve specific datasets related to companies, such as job listings, decision makers, news articles, G2 etc.

- **Request Example (Job Listings)**
    
    To retrieve data for job listings, make a POST request to the following endpoint:
    
    ## **Request URL**
    
    ```
    https://api.crustdata.com/data_lab/job_listings/Table/
    ```
    
    ## **Request Headers**
    
    | **Header Name** | **Description** | **Example Value** |
    | --- | --- | --- |
    | Accept | Specifies the types of media that the client can process. | **`application/json, text/plain, */*`** |
    | Accept-Language | Specifies the preferred language for the response. | **`en-US,en;q=0.9`** |
    | Authorization | Contains the authentication credentials for HTTP authentication. | **`Token $token`** |
    | Content-Type | Indicates the media type of the resource or data. | **`application/json`** |
    | User-Agent | Contains information about the user agent (browser) making the request. | **`Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ...`** |
    
    ## **Request Body**
    
    | **Parameter** | **Type** | **Description** | **Example Value** |
    | --- | --- | --- | --- |
    | tickers | Array | Can contain specific tickers for filtering. | **`[]`** |
    | dataset | Object | Contains details about the dataset being requested. | **`{"name":"job_listings","id":"joblisting"}`** |
    | filters | Object | Contains conditions for filtering the data. | See detailed breakdown below. |
    | groups | Array | For grouping the data. | **`[]`** |
    | aggregations | Array | For data aggregations. | **`[]`** |
    | functions | Array | For applying functions on the data. | **`[]`** |
    | offset | Number | The starting point for data retrieval. | **`0`** |
    | count | Number | The number of records to retrieve. | **`100`** |
    | sorts | Array | For sorting the data. | **`[]`** |
    
    **Filters Object Breakdown**
    
    | **Parameter** | **Type** | **Description** | **Example Value** |
    | --- | --- | --- | --- |
    | op | String | The operation for the condition. It can be logical operations like **`and`**, **`or`**, etc. | **`and`** |
    | conditions | Array | An array of conditions. Each condition can have sub-conditions. | See detailed breakdown below. |
    
    **Sub-Condition Breakdown**
    
    | **Parameter** | **Type** | **Description** | **Example Value** |
    | --- | --- | --- | --- |
    | column | String | The column to be filtered. | **`company_id`** |
    | type | String | The type of operation for filtering. Common operations include **`=`**, **`>`**, **`<`**, **`=>`**, etc. | **`=`** |
    | value | Various | The value for filtering. The datatype can vary based on the column being filtered. | **`7576`** |
    
    ## Response Body
    
    | **Parameter** | **Type** | **Description** |
    | --- | --- | --- |
    | fields | Array | An array of objects detailing the attributes of the job listings. |
    | rows | Array | Contains the job listings data. Each entry corresponds to the attributes in the "fields" section. |
    
    **Fields Object Breakdown**
    
    | **Parameter** | **Type** | **Description** |
    | --- | --- | --- |
    | type | String | The data type of the field. |
    | api_name | String | The name used in the API for this field. |
    | hidden | Boolean | Indicates if the field is hidden. |
    | options | Array | Related options for the field. |
    | summary | String | A brief summary of the field. |
    | local_metric | Boolean | Indicates if the field is a local metric. |
    | display_name | String | The display name of the field. |
    | geocode | Boolean | Indicates if the field contains geocode data. |