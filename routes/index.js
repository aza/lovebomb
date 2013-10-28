
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
  console.log( req.query, req.query.data )

  var data = JSON.parse( req.query.data )
  console.log( data )

  var dbData = {
    bomber: {
      number: data.bomber.number,
      name:   data.bomber.name,
      call: {
        status: 'in-progress',
        recordingUrl: null
      },
    },

    recipient: {
      number: data.recipient.number,
      name:   data.recipient.name
    }
  }

  var item = dbRef.push( dbData )
  var id = item.name()

  dispatcher.call(
    dbData.bomber.number,
    'http://lovebomb.herokuapp.com/record.xml?id='+id
  )

  res.send(dbData)
}

exports.sendBombToRecipient = function(req, res){
  /* Perform call */

  console.log( "SEND BOMB DATA", req.query)

  dispatcher.call(
    req.query.recipientNumber,
    'http://lovebomb.herokuapp.com/send.xml?id'+req.query.id
  )
  res.send(req.query)
}


exports.recordCallDone = function(req, res){
  console.log( "RECORDING", req.query )
  var bombRef = dbRef.child( req.query.id )

  bombRef.child('call').set({
    status: 'done',
    recordingUrl: req.query.RecordingUrl
  })

  res.send('true')
}

exports.recordXml = function(req,res){
  dbRef.child(req.query.id).once('value', function(snapshot){
    var data = snapshot.val()
    data.id = req.query.id
    res.render('record', data)
  })
}

exports.sendXml = function(req,res){
  dbRef.child(req.query.id).once('value', function(snapshot){
    var data = snapshot.val()
    data.id = req.query.id
    res.render('send', data)
  })
}
