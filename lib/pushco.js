/*
*
* Basic Client Lib for Push.co
* Send Push notifications to your iPhone from AdWords Scripts
*
* @source: 
* https://github.com/kaugesaar/adwords-scripts
*
* With inspiration from: 
* http://www.freeadwordsscripts.com/2014/01/make-calls-and-send-text-messages-to.html
*
*/

function PushCo(apiKey, apiSecret) {
    this.API_KEY = apiKey;
    this.API_SECRET = apiSecret;

    this.API_URL= 'https://api.push.co/1.0/push';

    this.sendPushMessage = function(message) {
        var options = {
            'method' : 'POST',
            'payload': {
                'message' : message,
                'api_key' : this.API_KEY,
                'api_secret' : this.API_SECRET,
            },
        };

        http_post(this.API_URL,options);
    }

    this.sendPushUrl = function(message,url) {
        var options = {
            'method' : 'POST',
            'payload' : {
                'message' : message,
                'url' : url,
                'view_type' : 1,
                'api_key' : this.API_KEY,
                'api_secret' : this.API_SECRET,
            },
        };

        http_post(this.API_URL,options);
    }

    function http_post(url,options) {
        var response = UrlFetchApp.fetch(url,options).getContentText();
        return JSON.parse(response)['message'];
    }
}