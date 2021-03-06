//require the Twilio module and create a REST client
var client = require('twilio')('AC15cd7e1236a030d64726592c2abf5e62', '517ce6bcbc8b170211e0e52d7c5b132d');
var twilioApplicationSid = 'APcc36583ff5fe95b3b8c970e5b916edf5';

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

exports.text = function(number, actionUrl, params){
  console.log( "SENDING TEXT")
  client.sendMessage({
      body: params.message,
      to:'+1' + number, // Any number Twilio can call
      from: '+16503535591', // A number you bought from Twilio and can use for outbound communication
      method: "GET"
  }, function(err, responseData) {
      //executed when the sms has been initiated.
      console.log("SMS ERROR", err ); // outputs "+14506667788"
      //console.log( responseData.subresource_uris )
  });
}

exports.call = function(number, actionUrl, urlParams){
  console.log( "DISPATCHER MAKING CALL")
  urlParams = urlParams || {}
  serializedParams = Object.keys(urlParams).map(function(p){return p + '=' + encodeURIComponent(urlParams[p])}).join('&')
  if( serializedParams.length > 0 ) serializedParams = "?" + serializedParams
  console.log( actionUrl + serializedParams )
  client.makeCall({
      to:'+1' + number, // Any number Twilio can call
      from: '+16503535591', // A number you bought from Twilio and can use for outbound communication
      url: actionUrl + serializedParams,
      method: "GET"
  }, function(err, responseData) {

      //executed when the call has been initiated.
      console.log("DISPATCHER ERROR", err ); // outputs "+14506667788"
      //console.log( responseData.subresource_uris )

  });
}



/*
  /calls


  /lovebombs
    /lovebombID
      bomber: phoneNumber
      /bomber
        phoneNumber
        name:
        metaData:
        /call
           status: started|done|failed
           recordUrl: xxx
      /invites
        /invitee
          name
          phone
          status
          call: {
            xxx
          }
          /invites {...}


 /users[]
   /phoneNumberAsId
     currentLocation:
     currentTimezone:

*/
