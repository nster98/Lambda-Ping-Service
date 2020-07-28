const fs = require('fs');
const request = require('request');
const async = require('async');
const jsonData = require('./test-servers.json');

function makeHTTPcallGET(info, cbMakeHTTPCallGet) {

    request.get(info.url, function(errGetHTTP, resGetHTTP, bodyGetHTTP) {
        if (errGetHTTP) {
            console.error('errGetHTTP for url = ' + info.url);
            return cbMakeHTTPCallGet(errGetHTTP);
        }
        console.log("URL:", info.url, "\t->\t", resGetHTTP.statusCode);

        if (resGetHTTP.statusCode !== info.validResponse)
        {
            console.error('unexpected response code of = ' + resGetHTTP.statusCode);
            return cbMakeHTTPCallGet(new Error('unexpected response code = ' + resGetHTTP.statusCode));
        }

        return cbMakeHTTPCallGet();
    });
}

function makeHTTPcallPOST(info, cbMakeHTTPCallPost) {

    request.post(info.url, {payload: info.payload}, function(errPostHTTP, resPostHTTP, bodyPostHTTP) {
        if (errPostHTTP) {
            console.error('errPostHTTP for url = ' + info.url);
            return cbMakeHTTPCallPost(errPostHTTP);
        }
        console.log("URL:", info.url, "\t->\t", resPostHTTP.statusCode);

        if (resPostHTTP.statusCode !== info.validResponse)
        {
            console.error('unexpected response code of = ' + resPostHTTP.statusCode);
            return cbMakeHTTPCallPost(new Error('unexpected response code = ' + resPostHTTP.statusCode));
        }

        return cbMakeHTTPCallPost();
    });
}

function triggerError(err, param)
{
    async.eachOf(param.errorNotification, function(value, key, cb) {

        var webhook = param.errorNotification[key];
        var payload = {};

        if (webhook.includes("discordapp"))
        {
            payload = {
                "method": 'POST',
                "headers": {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username": "Career Place Test",
                    "content": "" + err
                })
            };
        }
        else {
            payload = {
                method: 'POST',
                body: {
                    url: param.url
                },
                json: true
            };
        }

        request.post(webhook, payload, function(err, res, body) {
            console.log(body);
        });
    });
}

async.eachOf(jsonData, function(value, key, cb){
    //console.log(jsonData[key].url);
    var info = jsonData[key];

    if (info.method === "GET") {
        //tasks.push(function(cbTask) {
            makeHTTPcallGET(info, function(errGet) {
                if (errGet) {
                    console.log("got error in GET for ", info.url);
                    triggerError(errGet, info);
                    cb(errGet);
                }

            });
        //});
    }

    // If the required check is a POST, must use payload in the post when calling the URL
    else if (info.method === "POST") {
        //tasks.push(function(cbTask) {
            makeHTTPcallPOST(info, function(errPost) {
                if (errPost) {
                    console.log("got error in POST for ", info.url);
                    triggerError(errPost, info);
                    cb(errPost);
                }
                //return cbTask();
            });
        //});
    }
}, function() {

});

//exports.handler = function(event, handler, callback) => {

//};
