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
app.listen(3006);

app.get('/webhook', function (req, res) {
  console.log('get webhook -->'+req.query['hub.verify_token']);
 if (req.query['hub.verify_token'] === 'EAAO1ZAyrf4qMBAJBdrB1uaKQZBNyLKHB7IZA3lP1iA91bZCcsNKYp2UsaBZBSP9tSOdPv73AWKKvjo5U0C7DdPB7ZA3a7B2udrBrwk1pLv10fL9RXeU43XSHRmJfZByzgZCIgk96dHFPqd6kSuZA4zPddCQuMMVNqLIaWrIy2MgX9PQZDZD') {
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
app.post('/webhook/', function (req, res) {
  //console.log('post webhook');
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    if (event.postback) {
      text = JSON.stringify(event.postback);
      console.log(' in postback the text  is ='+text);
      if(text==='{"payload":"Pick and Choose"}'){
         sendRoomMessage(sender);
       }else if(text==='{"payload":"Package"}'){
         sendPackageMessage(sender);
       }else if(text==='{"payload":"One Room"}'){
         sendWellKeptMessage(sender);
       }else if(text==='{"payload":"Two Room"}'){
         sendWellKeptMessage(sender);
       }else if(text==='{"payload":"Three Room"}'){
         sendWellKeptMessage(sender);
       }else if(text==='{"payload":"BookCleaningService"}'){
         sendTextMessage(sender, "Please tell the date in (dd/mm/yyyy) format.", token);
       }else if(text==='{"payload":"Balance Enquiry"}'){
         sendTextMessage(sender, "You have $3125.57 in your checking account and $521.08 in your savings account.", token);
       }else if(text==='{"payload":"Lowest APR Credit Card"}'){
         sendCreditCardOffersMessage(sender);
       }else if(text==='{"payload":"Credit Card Statement"}'){
         sendCreditCardStatementMessage(sender);
       }else if(text==='{"payload":"Last 5 transactions"}'){
         sendTextMessage(sender, " For savings account 1. credit $25, $521.08. 1. credit $15, $481.08. 1. credit $5, $476.08. 1. credit $25, $451.08. 1. credit $25, $426.08 ", token);
       }else if(text==='{"payload":"Check - in"}'){
         sendTextMessage(sender, " Please provide your DL number to check - in. Please send a message in this format 'ID:XXX XXX XXX'", token);
       }else if(text==='{"payload":"Book Car"}'){
          sendCarRentalMessage4(sender);
       }else if(text==='{"payload":"Start Navigation"}'){
          sendCarRentalMessage(sender);
       }else if(text==='{"payload":"Call the centre"}'){
          sendCarRentalMessage(sender);
       }else if(text==='{"payload":"Cancel Reservation"}'){
         sendTextMessage(sender, "Your reservation has been successfully cancelled.");
       }else{
         sendTextMessage(sender, "Currently our AI bot is napping. So I cannot make sense of this '"+text.substring(0, 200), token)+"' text.";
       }
       continue;
     }
    sender = event.sender.id;

    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
      //console.log(text);
      if (text === 'Republic') {
        sendRepublicMessage(sender);
        continue;
      }else if (text === 'Car Rental') {
        sendTextMessage(sender, "Thanks! Please select from our available Cars.");
        sendCarRentalMessage(sender);
        continue;
      }else if (text === 'Bank') {
        sendBankMessage(sender);
        continue;
      }else if (text === 'Balance') {
        sendTextMessage(sender, "Your Account # is 112233445566. The Balance is $5,680. The last transaction was for $48 on 10th April 2016 with check number 106738.", token);
        continue;
      }else if (text === 'Credit Statement') {
        sendTextMessage(sender, "Total outstanding balance is $2000. Minimum payment due is $500. Payment due date is 14th May 2016.");
        sendCreditCardStatementMessage(sender);
        continue;
      }else if (text === 'Lowest Interest Rate') {
        sendTextMessage(sender, "Here are the list of credit cards we offer");
        sendLowestInterestRateMessage(sender);
        continue;
      }else if (text === 'Coffee') {
        //console.log('counter = '+counter);
        var titleValue;
        if(counter===4){
          counter=0;
          titleValue="You are eligible for a free coffee";
        }else{
          titleValue="You are just "+(5-(++counter))+" cups away from a free coffee";
        }
        //console.log('sender id ='+req.body.entry[0].messaging[i].sender.id);
        //console.log('recipient id ='+req.body.entry[0].messaging[i].recipient.id);
        sendCoffeeMessage(sender,titleValue);
        continue;
      }else if (text === 'CleanHouse') {
        sendCleanHouseMessage(sender);
        continue;
      }else{
        if(text.indexOf('/')>-1){
          sendTextMessage(sender, "How many bathroom, bedroom,kitchen,living room and other room do you have?(Please enter a response as comma separated values like 3,3,1,1,0)");
          continue;
        }else if(	text.indexOf(',')>-1){
          console.log(" comma value found "+text);
          var bathroom = text.substring(0,1);
          console.log("bathroom = "+bathroom);
          var bedroom = text.substring(2,3);
          console.log("bedroom = "+bedroom);
          var kitchen = text.substring(4,5);
          console.log("kitchen = "+kitchen);
          var livingroom = text.substring(6,7);
          console.log("living room = "+livingroom);
          var otherroom = text.substring(8,9);
          console.log("other room = "+otherroom);
          sendToWellKeptSiteMessage(sender);
          continue;
        }else if(	text.indexOf('ID:')>-1){
          console.log("ID: value found "+text);
          var dl = text.substring(3,111);
          console.log("ID = "+dl);
          sendTextMessage(sender, " You have successfully checked in. Your Car & paperwork will be ready when you reach here. Send us a message if you need anything.");
          sendCarRentalWelcomeMessage(sender);
          continue;
        }
          sendTextMessage(sender, "Currently our AI bot is napping. So I cannot make sense of this '"+text.substring(0, 200), token)+"' text.";
      }
    }
  }
  res.sendStatus(200);
});

var token = "EAAO1ZAyrf4qMBAJBdrB1uaKQZBNyLKHB7IZA3lP1iA91bZCcsNKYp2UsaBZBSP9tSOdPv73AWKKvjo5U0C7DdPB7ZA3a7B2udrBrwk1pLv10fL9RXeU43XSHRmJfZByzgZCIgk96dHFPqd6kSuZA4zPddCQuMMVNqLIaWrIy2MgX9PQZDZD";
function sendCarRentalWelcomeMessage(sender) {
  console.log('sending a car rental welcome message.');
  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Welcome",
          "subtitle": " ",
          "image_url": "https://s3.amazonaws.com/facebookbot/Map.png",
          "buttons": [{
            "type": "postback",
            "title": "Start Navigation",
            "payload": "Start Navigation",
          },{
            "type": "postback",
            "title": "Call the centre",
            "payload": "Call the centre",
          }],
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

function sendLowestInterestRateMessage(sender)
{
  messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"NBA American Express Card",
            "image_url":"https://s3.amazonaws.com/facebookbot/NBA+American+Express+Card.png",
            "subtitle":"9.49% to 29.49% variable APR based on your creditworthiness",
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.efirstbank.com/customer-service/find-location.htm",
                "title":"Apply for this card"
              },
              {
                "type":"web_url",
                "url":"https://www.efirstbank.com/products/credit-loan/credit-cards/credit-cards-visa.htm",
                "title":"View Details",
              },
              {
                "title":"View APR, Terms & Fees",
                "type":"web_url",
                "url":"https://www.efirstbank.com/products/credit-loan/credit-cards/credit-card-agreement.htm",
              }
            ]
          },
          {
            "title":"Clearpoints Credit Card",
            "image_url":"https://s3.amazonaws.com/facebookbot/Clearpoints+Credit+Card.png",
            "subtitle":"9.49% to 23.49% variable APR based on your creditworthiness",
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.efirstbank.com/customer-service/find-location.htm",
                "title":"Apply for this card"
              },
              {
                "type":"web_url",
                "url":"https://www.efirstbank.com/products/credit-loan/credit-cards/credit-cards-visa.htm",
                "title":"View Details",
              },
              {
                "title":"View APR, Terms & Fees",
                "type":"web_url",
                "url":"https://www.efirstbank.com/products/credit-loan/credit-cards/credit-card-agreement.htm",
              }
            ]
          },
          {
            "title":"Select Credit Card",
            "image_url":"https://s3.amazonaws.com/facebookbot/Select+Credit+Card.png",
            "subtitle":"1.49% to 17.49% variable APR based on your creditworthiness",
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.efirstbank.com/customer-service/find-location.htm",
                "title":"Apply for this card"
              },
              {
                "type":"web_url",
                "url":"https://www.efirstbank.com/products/credit-loan/credit-cards/credit-cards-visa.htm",
                "title":"View Details",
              },
              {
                "title":"View APR, Terms & Fees",
                "type":"web_url",
                "url":"https://www.efirstbank.com/products/credit-loan/credit-cards/credit-card-agreement.htm",
              }
            ]
          }
        ]
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
function sendCarRentalMessage(sender)
{
  messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Nissan Versa",
            "image_url":"https://s3.amazonaws.com/facebookbot/Nissan+Versa.png",
            "subtitle":"95.40 USD per day, 4 Passenger, 1 Large and 1 Small suitcase ",
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.enterprise.com/en/car-rental/vehicles/ca/cars/compact.html",
                "title":"Pay Now($45/day)"
              },
              {
                "type":"web_url",
                "url":"https://www.enterprise.com/en/car-rental/vehicles/ca/cars/compact.html",
                "title":"Pay Now($60/day)"
              },
              {
                "type":"postback",
                "title":"Book Car",
                "payload":"Book Car"
              }
            ]
          },
          {
            "title":"Toyota Corolla",
            "image_url":"https://s3.amazonaws.com/facebookbot/Toyota+Corolla.png",
            "subtitle":"105 USD per day, 5 Passenger, 1 Large and 2 Small suitcase ",
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.enterprise.com/en/car-rental/vehicles/ca/cars/intermediate.html",
                "title":"Pay Now($75/day)"
              },
              {
                "type":"web_url",
                "url":"https://www.enterprise.com/en/car-rental/vehicles/ca/cars/intermediate.html",
                "title":"Pay Now($90/day)"
              },
              {
                "type":"postback",
                "title":"Book Car",
                "payload":"Book Car"
              }
            ]
          },
          {
            "title":"Chrysler 200",
            "image_url":"https://s3.amazonaws.com/facebookbot/Chrysler.png",
            "subtitle":"113.6 USD per day, 5 Passenger, 2 Large and 2 Small suitcase ",
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.enterprise.com/en/car-rental/vehicles/ca/cars/standard.html",
                "title":"Pay Now($95/day)"
              },
              {
                "type":"web_url",
                "url":"https://www.enterprise.com/en/car-rental/vehicles/ca/cars/compact.html",
                "title":"Pay Now($115/day)"
              },
              {
                "type":"postback",
                "title":"Book Car",
                "payload":"Book Car"
              }
            ]
          }
        ]
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




function sendCarRentalMessage4(sender) {
  console.log('sending a message to car rental');
  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Car Rental 100,000 people liked it.",
          "subtitle": "You have upcoming pickup tomorrow.",
          "image_url": "https://s3.amazonaws.com/facebookbot/Car+Rental+Logo.png",
          "buttons": [{
            "type": "postback",
            "payload": "Cancel Reservation",
            "title": "Cancel Reservation"
          },{
            "type": "postback",
            "title": "Check - in",
            "payload": "Check - in",
          }],
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
function sendCleanHouseMessage(sender) {
  console.log('sending a message to clean the house');
  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "WellKept",
          "subtitle": "Welcome to WellKept!! The only cleaning service that lets you clean just one room. Book now at just $15 a room.",
          "image_url": "https://www.wellkept.com/css/images/home-bg.jpg",
          "buttons": [{
            "type": "web_url",
            "url": "https://www.wellkept.com/index.html#/",
            "title": "Please click this link to go to our website."
          },{
            "type": "postback",
            "title": "Book Cleaning Service",
            "payload": "BookCleaningService",
          }],
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
function sendWellKeptMessage(sender) {
  console.log('sending a well kept message.');
  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "First card",
          "subtitle": "Element #1 of an hscroll",
          "image_url": "https://www.wellkept.com/css/images/home-bg.jpg",
          "buttons": [{
            "type": "web_url",
            "url": "https://www.wellkept.com/index.html#/",
            "title": "Web url"
          },{
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for first element in a generic bubble",
          }],
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
function sendRepublicMessage(sender) {
  console.log('sending a republic message.');
  messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Do you want a package or pick and choose rooms on your own?",
            "buttons":[
              {
                "type":"postback",
                "title":"Package",
                "payload":"Package"
              },
              {
                "type":"postback",
                "title":"Pick and Choose",
                "payload":"Pick and Choose"
              }
            ]
          }
        ]
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
function sendRoomMessage(sender) {
  console.log('sending a room message.');
  messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"How many number of rooms are there",
            "buttons":[
              {
                "type":"postback",
                "title":"One Room",
                "payload":"One Room"
              },
              {
                "type":"postback",
                "title":"Two Room",
                "payload":"Two Room"
              },
              {
                "type":"postback",
                "title":"Three Room",
                "payload":"Three Room"
              }
            ]
          }
        ]
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
function sendToWellKeptSiteMessage(sender) {
  console.log('sending to well kept site a message');
  messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Press continue to go to wellkept site.",
            "buttons":[
              {
                "type":"web_url",
                "url":"http://c4a763e2.ngrok.io/index.html#/room-cleaning",
                "title":"continue"
              },
              {
                "type":"web_url",
                "url":"http://c4a763e2.ngrok.io/index.html#/room-cleaning",
                "title":"post"
              }
            ]
          }
        ]
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

function sendCreditCardOffersMessage(sender) {
  console.log('sending a credit card offers message.');
  messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Here are the credit card offers we have.",
            "image_url": "https://s3.amazonaws.com/facebookbot/creditcard.png",
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.efirstbank.com/customer-service/find-location.htm",
                "title":"Apply for this card"
              },
              {
                "type":"web_url",
                "url":"https://www.efirstbank.com/products/credit-loan/credit-cards/credit-cards-visa.htm",
                "title":"View Details",
              },
              {
                "title":"View APR, Terms & Fees",
                "type":"web_url",
                "url":"https://www.efirstbank.com/products/credit-loan/credit-cards/credit-card-agreement.htm",
              }
            ]
          }
        ]
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

function sendCreditCardStatementMessage(sender) {
  console.log('sending a credit card statement message.');
  messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Please see your credit card statement below.",
            "image_url": "https://s3.amazonaws.com/facebookbot/creditcard.png",
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.billdesk.com/pgidsk/pgmerc/amexcard/amex_card.jsp",
                "title":"Pay minimum payment due"
              },
              {
                "type":"web_url",
                "url":"https://www.billdesk.com/pgidsk/pgmerc/amexcard/amex_card.jsp",
                "title":"Pay outstanding balance",
              },
              {
                "title":"Increase credit limit",
                "type":"web_url",
                "url":"https://www.americanexpress.com/in/content/credit-know-how/credit-card-limits/",
              }
            ]
          }
        ]
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

function sendPackageMessage(sender) {
  console.log('sending a package message.');
  messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Which Package do you want to pick?",
            "buttons":[
              {
                "type":"web_url",
                "url":"https://petersapparel.parseapp.com/view_item?item_id=100",
                "title":"Bathroom Scrub"
              },
              {
                "type":"web_url",
                "url":"https://petersapparel.parseapp.com/view_item?item_id=101",
                "title":"Bedroom Clean",
              },
              {
                "title":"Bedroom Clean",
                "type":"web_url",
                "url":"https://petersapparel.parseapp.com/view_item?item_id=102",
              }
            ]
          }
        ]
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




function sendBankMessage(sender) {
  console.log('sending a bank message.');


  messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":"Welcome to First Bank!! 100000 people liked this Banking",
            "image_url": "https://s3.amazonaws.com/facebookbot/FirstBankLogo.png",
            "buttons":[
              {
                "type":"postback",
                "title":"Balance Enquiry",
                "payload":"Balance Enquiry"
              },
              {
                "type":"postback",
                "title":"Lowest APR Credit Card",
                "payload":"Lowest APR Credit Card"
              },
              {
                "type":"postback",
                "title":"Credit Card Statement",
                "payload":"Credit Card Statement"
              }
            ]
          }
        ]
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
var counter=0;
function sendCoffeeMessage(sender,titleValue) {
  console.log('sending a coffee message.');
  messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
          {
            "title":titleValue,
            "image_url":"https://s3-eu-west-1.amazonaws.com/gauravshukla/picture/711.png",
            "subtitle":"QR_Code",

          }
        ]
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
// Log server start message
console.log('Server started successfully');
