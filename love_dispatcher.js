//require the Twilio module and create a REST client
var client = require('twilio')('AC15cd7e1236a030d64726592c2abf5e62', '517ce6bcbc8b170211e0e52d7c5b132d');

/*
//Send an SMS text message
client.sendMessage({

    to:'+16508045596', // Any number Twilio can deliver to
    from: '+16503535591', // A number you bought from Twilio and can use for outbound communication
    body: 'word to your mother.' // body of the SMS message

}, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) { // "err" is an error received during the request, if any

        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

        console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."

    }
});
*/

exports.callBomber = function(number){
  //Place a phone call, and respond with TwiML instructions from the given URL
  console.log('here')
  client.makeCall({

      to:'+1' + number, // Any number Twilio can call
      from: '+16503535591', // A number you bought from Twilio and can use for outbound communication
      url: 'http://lovebomb.herokuapp.com/xml/record.xml',
      method: "GET",
      Record: false,
      StatusCallback: 'http://lovebomb.herokuapp.com/recording',
      StatusCallbackMethod: 'GET'
  }, function(err, responseData) {

      //executed when the call has been initiated.
      console.log(err ); // outputs "+14506667788"
      console.log( responseData.subresource_uris )

  });
}
