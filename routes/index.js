
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

function fetchLovebombById( id, callback ){
  dbRef.child(id).once('value', function(snapshot){
    callback(snapshot.val())
  })
}


exports.callFriend = function(req, res){
  fetchLovebombById( req.query.id, function(data){
    var friendNum = req.query.friendNum
    console.log( "FRIEND", friendNum, data.friends[friendNum] )
    var friendRef = dbRef.child(req.query.id).child('friends').child(friendNum)
    friendRef.update({
      call:{
        recordingUrl: 'nothing',
        status: 'completed'
      }
    })
    res.send(data)
  })

}

exports.sendBombToRecipient = function(req, res){
  /* Perform call */
  fetchLovebombById(req.query.id, function(data){
    dispatcher.call(
      data.recipient.number,
      'http://lovebomb.herokuapp.com/send.xml',
      {id: req.query.id}
    )
    res.send("Sending")
  })
}


exports.recordCallDone = function(req, res){
  console.log( "RECORDING", req.query )
  var bombRef = dbRef.child( req.query.id )

  bombRef.child(req.query.path).child('call').set({
    status: req.query.CallStatus,
    recordingUrl: req.query.RecordingUrl
  })

  res.send('true')
}

exports.genericXmlRenderer = function(req,res){
  var pageName = req.params[0]
  fetchLovebombById(req.query.id, function(data){
    // Mix all values from the query into the data passed into the template
    Object.keys(req.query).forEach(function(key){ data[key] = req.query[key] })
    res.render(pageName, data)
  })
}
