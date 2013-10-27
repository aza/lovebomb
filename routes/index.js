
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



  var item = dbRef.push( dbData )
  var id = item.name()

  dispatcher.call( req.query.bomberNumber, id )
  res.send('ID OF PHONE CALL')
}

exports.callRecipient = function(req, res){
  /* Perform call */
  res.send('ID OF PHONE CALL')
}


exports.recordCallDone = function(req, res){
  console.log( "RECORDING" )
  console.log( req.query )

  var bombRef = dbRef.child( req.query.id )

  bombRef.child('call').set({
    status: 'done',
    recordingUrl: req.query.RecordingUrl
  })

  res.send('true')
  //console.log( req )
}

exports.xml = function(req,res){
  res.render('record', {id: req.query.id})
}
