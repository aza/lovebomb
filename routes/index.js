
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
  console.log( "START BOMB BIGTIME ")
  console.log(req.query)
  console.log(req.query.data )

  var data = JSON.parse( req.query.data )
  console.log( data )

  var item = dbRef.push( data )
  var id = item.name()

  //console.log(item)
  console.log( "START BOMB id: " + id)

  dispatcher.call(
    data.bomber.number,
    'http://lovebomb.herokuapp.com/record.xml',
    {id: id, path: 'bomber'}
  )

  res.send(id)
}

function fetchLovebombById( id, callback ){
  console.log("fetchLovebombById: " + id)
  dbRef.child(id).once('value', function(snapshot){
    callback(snapshot.val())
  })
}

exports.invite = function(req, res) {
  console.log("INVITE")
  fetchLovebombById( req.query.id, function(data){
    
    console.log("GOT LOVEBOMB ID" + req.query.id)

    if( data ){
      data.id = req.query.id
      res.render('invite', data )
    } else {
      res.send('Lovebomb not found')
    }
  })
}

exports.textFriend = function(req, res){
  fetchLovebombById( req.query.id, function(data) {
    var friendNum = req.query.friendNum

    console.log( "TEXTFRIEND", friendNum, data.friends[friendNum] )
    dispatcher.text(
      data.friends[friendNum].number,
      {id: req.query.id, message: req.query.message}
    )

    var lovebombRef = dbRef.child( req.query.id )
    lovebombRef.child('friends/'+friendNum).child('text').set({
      status: "complete",
      message: req.query.message,
      date: (new Date()).toUTCString()
    })

    res.send(data)
  })
}

exports.callFriend = function(req, res){
  fetchLovebombById( req.query.id, function(data){
    var friendNum = req.query.friendNum
    console.log( "FRIEND", friendNum, data.friends[friendNum] )
    dispatcher.call(
      data.friends[friendNum].number,
      'http://lovebomb.herokuapp.com/recordFriend.xml',
      {id: req.query.id, path:'friends/'+friendNum}
    )
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
  var lovebombRef = dbRef.child( req.query.id )

  lovebombRef.child(req.query.path).child('call').set({
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

exports.link = function(req, res){
  fetchLovebombById( req.query.q, function(data){
    console.log( data )
    if( data ){
      data.id = req.query.q
      res.render('link', data )
    } else {
      res.send('Lovebomb not found')
    }
  })

}
