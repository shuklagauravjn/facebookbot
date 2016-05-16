// get express library
var express = require('express');

// get path library
var path = require('path');
var request = require("request");
var bodyParser = require('body-parser')
// Decalre application
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Define root path of application
var rootPath = path.normalize(__dirname + '/../');
// Serve static pages as is from app directory
app.use(express.static(rootPath + '/app'));
// Define server port
app.listen(process.env.PORT||3001);

app.get('/webhook', function (req, res) {
  console.log('get webhook -->'+req.query['hub.verify_token']);
 if (req.query['hub.verify_token'] === 'EAAMdMrzztUMBADgZBya8j9ZBLrdUij2ddAZBzkdkuSpymfiNjhhvZBWKxXX8VNooD6MOWkCW2hCU5TWss3zNPqzXkwhTaoIPlkgZBjJxwlLWmb8ZCcbK9G1nmKqxpIQGiKAk0ZBUXibTNR4IwZAUdn9eS1hAAZC0hFfhs2X88DPYJcAZDZD') {
   res.send(req.query['hub.challenge']);
 } else {
   res.send('Error, wrong validation token');
 }
});
var healthCounter = 0;
app.get('/index.html', function (req, res) {
  console.log('Healthy '+healthCounter+' times');
  res.send('Healthy '+healthCounter+' times');
  healthCounter++;
});
var counter=0;
app.post('/webhook/', function (req, res) {
  //console.log('post webhook');

  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    console.log('sender id ='+req.body.entry[0].messaging[i].sender.id);
    console.log('recipient id ='+req.body.entry[0].messaging[i].recipient.id);
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;

    if (event.message && event.message.text) {
      text = event.message.text;
      if (text.indexOf('new')>-1) {
        sendInitialFreeDrinkMessage(sender);
        continue;
      }else if (text.indexOf('resend')>-1 || text.indexOf('buy')>-1 || text.indexOf('free')>-1) {
        if(counter===4){
          counter=0;
          sendTextMessage(sender,"Congrats you just earned a free coffee.");
          sendFreeMessage(sender);
          sendTextMessage(sender,"Hope you loved your free coffee. Looking forward to having you again.");
        }else{
          sendResendCodeMessage(sender);
          sendTextMessage(sender,"Thank you for buying another coffee. You are "+(3-(++counter))+" coffees away from a free one.");
        }
        continue;
      }else{
        sendTextMessage(sender, "Currently our AI bot is napping. So I cannot make sense of this '"+text.substring(0, 200), token);
      }
    }
   }
  res.sendStatus(200);
  });

var token = "EAAMdMrzztUMBADgZBya8j9ZBLrdUij2ddAZBzkdkuSpymfiNjhhvZBWKxXX8VNooD6MOWkCW2hCU5TWss3zNPqzXkwhTaoIPlkgZBjJxwlLWmb8ZCcbK9G1nmKqxpIQGiKAk0ZBUXibTNR4IwZAUdn9eS1hAAZC0hFfhs2X88DPYJcAZDZD";
function sendInitialFreeDrinkMessage(sender) {
  console.log('sending an initial free drink message.');
  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Welcome! Glad to have you with us. Here is the unique user code.",
          "subtitle": " ",
          "image_url": "https://s3.amazonaws.com/facebookbot/coffee/CoffeeCode.png"
        }]
      }
    }
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}
function sendTextMessage(sender, text) {
  console.log('sending text message');
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

function sendResendCodeMessage(sender)
{
  sendTextMessage(sender,"Hey! Here is your barcode.");
  console.log('sending a resend drink message.');
  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Hey! Here is your bar code.",
          "subtitle": " ",
          "image_url": "https://s3.amazonaws.com/facebookbot/coffee/CoffeeCode.png"
        }]
      }
    }
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

function sendFreeMessage(sender)
{
  console.log('sending an initial free drink message.');
  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Free Coupon",
          "subtitle": " ",
          "image_url": "https://s3.amazonaws.com/facebookbot/coffee/FreeCoupon.png"
        }]
      }
    }
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

console.log('Server started successfully');
