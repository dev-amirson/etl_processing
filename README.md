## Description
A server-side process written in typescript. It takes incoming JSON containing a UNIX timestamp, a URL string, and array of objects, and transform the data into a new format, parse different parts of the URL to make it easier to query downstream. It extract the domain, path name, turn the query string into a name-value pared object (each query string variable becomes a key with the query string parameter value), and the hash, and create a new object in the process.

## Installation
Execute the following command in project root directory to install all the dependencies being used by this project.

```bash
$ npm install
```

## Running the app
```bash
$ npm run start
```

## Test
The unit tests are written using Jest that is used by NestJs. To run the unit tests for this project, first install all the dependencies using `npm install` and the execute the following command in project's root directory.

```bash
$ npm run test
```
## Feature

### Input:

It takes Multiple JSON files, each individually gzipped, with the following structure:
```bash
{
  "ts": 1234567890,             // unix timestamp
	"u": "https://www.test.com/products/productA.html?a=5435&b=test#reviews"  // a url
  "e": [ {list of events} ]     // an array of objects, each object represents an event
}
```

### Transform:

For each event in the array, it create an output object which contains the following:
```bash
{
  "timestamp": ....                // same timestamp as parent
  "url_object": {                    // parsed URL object
    "domain": "www.test.com"   // domain
    "path": "/products/productA.html"         // path
    "query_object": {                  // query string object e.g. from ?q1=val1&q2=val2
			"a": "5435",
			"b": "test",
			... 
		}
    "hash": "#reviews"            // hash
  }
  "ec": {original event content}
}
```
