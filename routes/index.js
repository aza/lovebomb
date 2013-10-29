
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

  var item = dbRef.push( data )
  var id = item.name()

  dispatcher.call(
    data.bomber.number,
    'http://lovebomb.herokuapp.com/record.xml',
    {id: id, path: 'bomber'}
  )

  res.send(id)
}

exports.sendBombToRecipient = function(req, res){
  /* Perform call */

  console.log( "SEND BOMB DATA", req.query)

  dispatcher.call(
    req.query.recipientNumber,
    'http://lovebomb.herokuapp.com/send.xml',
    {id: req.query.id}
  )
  res.send(req.query)
}


exports.recordCallDone = function(req, res){
  console.log( "RECORDING", req.query )
  var bombRef = dbRef.child( req.query.id )

  bombRef.child(req.query.path).child('call').set({
    status: 'done',
    recordingUrl: req.query.RecordingUrl
  })

  res.send('true')
}

exports.genericXmlRenderer = function(req,res){
  var pageName = req.params[0]
  dbRef.child(req.query.id).once('value', function(snapshot){
    var data = snapshot.val()
    // Mix all values from the query into the data passed into the template
    Object.keys(req.query).forEach(function(key){ data[key] = req.query[key] })
    res.render(pageName, data)
  })
}
