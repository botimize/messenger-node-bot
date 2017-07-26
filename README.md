# Create your Facebook Messenger bot in node.js with botimize bot-analytics service

You can follow the [documentation](https://developers.facebook.com/docs/messenger-platform/guides/quick-start), where the Messagner team has prepared a clear guide written in node.js for the beginner.

Here is our 10 min guide to create an echo bot with [botimize](http://www.botimize.io) **bot analyitic**.

## Get start
Messanger uses the web server to receive and send the message(text, emoji, pic). You need to have the authority to talk to the web service and then the bot have to approved by Facebook developer platform in order to speak the public.

You can easily git clone the whole project, and run the server somewhere else e.g. heroku.

## Create a heroku account
Sign up an heroku account at [https://www.heroku.com](https://www.heroku.com).

## Set up the dependency

Create a project
```bash
npm init
```

install the package

```bash
npm install express request botimize body-parser
```

## Create your Facebook App and Page

First, go to [facebook developer dashboard](https://developers.facebook.com/apps)
Click [create new app](/img/create_new_app.png) to create a new app or **Add new app** if you already have some apps exsiting.

In the project dashboard, click 

![Add project](/img/add_project.png)

Then click **Messagner get start**

![Messange get start](/img/get_start.png)

Generate **facebook_access_token**

![Your_Facebook_Access_Token](/img/generate_token.png)

Keep this very long **Facebook_Access_Token** in a notebook, very important!

## Create a botimize account and a key for the project

Go to [botimize](https://dashboard.botimize.io/register) and create an account.

Create a new project by clicking new project.

![New_project](/img/botimize_new_project.png)

See your **Your_Botimize_Api_Key** by clicking Project Setting

![Project Setting](img/botimize_apiKey.png)

## Create a nodeJS bot

Create a node.js script (e.g. index.js) and copy this into it.
Notice your have to replace **Your_Facebook_Access_Token** and **Your_Botimize_Api_Key**.

```javascript
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
```

## Push to heroku

```bash
git init
git add .
git commmit -m "create a heroku project"
heroku create
git push heroku master
```
There will show a heroku-url on screen after you push to heroku.
Keep this Url (e.g. https://your_app_name.herokuapp.com).

## Talk to your bot

- Go to the [facebook developer dashboard](https://developers.facebook.com/apps) again, set up the webhook by filling https://your_app_name.herokuapp.com into the field and subscribe to your page. Your password for the webhook is **testbot_verify_token** which has shown in the upper nodejs script.

![webhook](/img/webhook_token.png)

- Now you can talk to your bot by clicking the "Send Message" on the fan page of the facebook.

![fanPage](/img/talk2Bot.png)

