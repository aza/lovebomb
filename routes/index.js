
/*
 * GET home page.
 */

var dispatcher = require('../love_dispatcher'),
    Firebase = require('firebase')

var dbRef = new Firebase('https://lovebomb.firebaseio.com/lovebombs')

exports.index = function(req, res){
  res.render('index');
};

exports.startBomb = function(req, res){
  /* Perform call */
  // TODO: Add proper error handling for query
  // TODO: Put the call into the Firebase in /calls
  console.log( req.query )

  var dbData = {
    bomber: {
      number: req.query.bomberNumber,
      name: req.query.bomberName,
      call: {
        status: 'in-progress',
        recordingUrl: null
      }
    },

    recipient: {
      number: req.query.recipientNumber,
      name: req.query.recipientName
    }
  }



  dbRef.push( dbData )

  dispatcher.call( req.query.bomberNumber )
  res.send('ID OF PHONE CALL')
}

exports.callRecipient = function(req, res){
  /* Perform call */
  res.send('ID OF PHONE CALL')
}


exports.recordCallDone = function(req, res){
  console.log( "RECORDING" )
  console.log( req.query )
  // req.query.RecordingUrl
  // Store the ID, the recorindg URL, and anything else in a Firebase of calls.
  // The client can listen for an event.
  res.send('true')
  //console.log( req )
}
