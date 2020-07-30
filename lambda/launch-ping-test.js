const request = require('request');
const async = require('async');
const jsonData = require('./test-servers.json');

function makeHTTPcallGET(info, cbMakeHTTPCallGet) {

    // Request library used for making HTTP call
    // Takes the URL, and checks for errors when calling
    request.get(info.url, function(errGetHTTP, resGetHTTP, bodyGetHTTP) {
        if (errGetHTTP) {
            console.error('errGetHTTP for url = ' + info.url);
            return cbMakeHTTPCallGet(errGetHTTP);
        }
        //console.log("URL:", info.url, "\t->\t", resGetHTTP.statusCode);

        // If the response code recieved by the call is not one of the valid response codes, create an
        // error and use the callback function with the error
        if (resGetHTTP.statusCode !== info.validResponse)
        {
            console.error('Unexpected Response Code of = ' + resGetHTTP.statusCode);
            return cbMakeHTTPCallGet(new Error('Unexpected Response Code = ' + resGetHTTP.statusCode));
        }

        return cbMakeHTTPCallGet();
    });
}

function makeHTTPcallPOST(info, cbMakeHTTPCallPost) {

    // Request library used for making HTTP call, uses POST with the payload specified in the JSON file
    // Takes the URL, and checks for errors when calling
    request.post(info.url, info.payload, function(errPostHTTP, resPostHTTP, bodyPostHTTP) {
        if (errPostHTTP) {
            console.error('errPostHTTP for url = ' + info.url);
            return cbMakeHTTPCallPost(errPostHTTP);
        }
        //console.log("URL:", info.url, "\t->\t", resPostHTTP.statusCode);

        // If the response code recieved by the call is not one of the valid response codes, create an
        // error and use the callback function with the error
        if (resPostHTTP.statusCode !== info.validResponse)
        {
            console.error('Unexpected Response Code of = ' + resPostHTTP.statusCode);
            return cbMakeHTTPCallPost(new Error('Unexpected Response Code = ' + resPostHTTP.statusCode));
        }

        return cbMakeHTTPCallPost();
    });
}

// Callback function
function triggerError(err, param)
{
    // Loop through each error notification from JSON and make the outgoing webhook call
    async.eachOf(param.errorNotification, function(value, key, cb) {

        var webhook = param.errorNotification[key];
        var payload = {};

        // Discord
        if (webhook.includes("discordapp"))
        {
            payload = {
                "method": 'POST',
                "headers": {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username": "Career Place Test",
                    "avatar_url": "https://static.wixstatic.com/media/da32a0_968f9a4652fe4b0082dacb0b6551151c~mv2.png/v1/fill/w_320,h_322,al_c,q_95/Career_place%20widget.webp",
                    "embeds": [
                        {
                          "title": "Error: " + param.url,
                          "description": "Error message: " + err,
                          "url": param.url,
                          "color": 14686489,
                          "footer": {
                            "text": ""
                          },
                          "timestamp": "2020-07-29T16:39:00.000Z"
                        }
                    ]
                })
            };
        }

        // Microsoft Teams
        else if (webhook.includes("outlook.office"))
        {
            payload = {
                "method": 'POST',
                "headers": {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "@type": "MessageCard",
                    "@context": "http://schema.org/extensions",
                    "themeColor": "000000",
                    "title": "Error for " + param.url,
                    "text": "" + err
                })
            };
        }

        // Slack
        else if (webhook.includes("slack"))
        {
            payload = {
                "method": 'POST',
                "headers": {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "text": "Error: " + param.url,
                    "attachments": [{
                        "text": "" + err
                    }]
                })
            };
        }

        // General Case
        else {
            payload = {
                method: 'POST',
                body: {
                    url: param.url,
                    text: "" + err
                },
                json: true
            };
        }

        request.post(webhook, payload, function(err, res, body) {
            console.log(body);
        });
    });
}

// Loop through each index of the JSON file, applying the function on each one
async.eachOf(jsonData, function(value, key, cb) {

    var info = jsonData[key];

    // If the required check is a GET, call the GET function
    if (info.method === "GET") {
        makeHTTPcallGET(info, function(errGet) {
            if (errGet) {
                console.log("got error in GET for ", info.url);
                triggerError(errGet, info);
                cb(errGet);
            }

        });
    }

    // If the required check is a POST, call the POST function
    else if (info.method === "POST") {
        makeHTTPcallPOST(info, function(errPost) {
            if (errPost) {
                console.log("got error in POST for ", info.url);
                triggerError(errPost, info);
                cb(errPost);
            }
        });
    }
}, function() {

});

//exports.handler = function(event, handler, callback) => {

//};
