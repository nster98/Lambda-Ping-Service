const fs = require('fs');
const request = require('request');
const jsonData = require('./example-json.json');

for (var key = 0; key < jsonData.length; key++)
{
    // Get URL and call it using NodeJS Request
    // Use the method to do either GET or POST with the right payload
    var url = jsonData[key].url;
    var method = jsonData[key].method;
    var payload = jsonData[key].payload;

    // Dummy responseCode
    let responseCode;

    // If the required check is a GET, simply call the URL and get a response code back
    if (method === "GET") {
        request.get(url, function(err, res, body) {
            console.error("Error:", err);
            responseCode = res.statusCode;
            console.log(responseCode);
        });
    }

    // If the required check is a POST, must use payload in the post when calling the URL
    else if (method === "POST") {
        request.post(url, {payload}, function(err, res, body) {
            console.error("Error:", err);
            responseCode = res.statusCode;
            console.log(responseCode);
        });
    }

    // If response is not equal to the expected resonse, trigger the error notification

}

//exports.handler = function(event, handler, callback) => {

//};
