var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

Botimize_Api_Key = 'Your_Botimize_Api_Key'
FACEBOOK_ACCESS_TOKEN = 'Your_Facebook_Access_Token'
const botimize = require('botimize')(Botimize_Api_Key,'facebook');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Facebook Webhook
app.get('/', function (req, res) {

    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
    
});

// handler receiving messages
app.post('/', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message) {
	        if(event.message.text){
                botimize.logIncoming(req.body);
                sendMessage(event.sender.id, {"text": event.message.text});
     	   }
        }
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    var options = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: FACEBOOK_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    };
    request(options, function(error, response, body) {
        botimize.logOutgoing(options);
        if (error) {
            console.log('Error sending message: ', error);
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });

};
