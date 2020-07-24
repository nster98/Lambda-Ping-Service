const fs = require('fs');
const request = require('request');
const async = require('async');
const jsonData = require('./test-servers.json');

function makeHTTPcallGET(info, callback) {

    let responseCode;
    request.get(url, function(err, res, body) {
        responseCode = res && res.statusCode;
        console.log("URL:", info.url, "\t->\t", responseCode);

    });

    setTimeout(function() {
        // If response is not equal to the expected resonse, trigger the error notification
        if (responseCode !== info.validResponse)
        {
            callback(info)
        }
    }, 3000);

}
function makeHTTPcallPOST(info, callback) {

    let responseCode;
    request.post(url, {payload: info.payload}, function(err, res, body) {
        responseCode = res && res.statusCode;
        console.log("URL:", info.url, "\t->\t", responseCode);

    });

    setTimeout(function() {
        // If response is not equal to the expected resonse, trigger the error notification
        if (responseCode !== info.validResponse)
        {
            callback(info)
        }
    }, 3000);

}
function triggerError(param)
{
    for (var i = 0; i < param.errorNotification.length; i++)
    {
        request.post(
            {
                url:    param.url,
            },
            function(err, res, body) {}/*=> console.log(err, body, res.statusCode)*/
        );
    }
}

for (var key = 0; key < jsonData.length; key++)
{
    // Get URL and call it using NodeJS Request
    // Use the method to do either GET or POST with the right payload
    var info = jsonData[key];

    var url = jsonData[key].url;
    var method = jsonData[key].method;
    var payload = jsonData[key].payload;
    var validResponse = jsonData[key].validResponse

    var tasks = [];

    // If the required check is a GET, simply call the URL and get a response code back
    if (method === "GET") {
        tasks.push(makeHTTPcallGET(info, triggerError), function(resp) {
            console.log("Get response", resp);
        });
    }

    // If the required check is a POST, must use payload in the post when calling the URL
    else if (method === "POST") {
        tasks.push(makeHTTPcallPOST(info, triggerError), function(resp) {
            console.log("Post response", resp);
        });
    }

    //async.parallelLimit(tasks, 1);

}

//exports.handler = function(event, handler, callback) => {

//};
