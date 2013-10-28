
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

  console.log('wup')
  var item = dbRef.push( dbData )
  var id = item.name()
  dbData.id = id

  dispatcher.call(
    dbData.bomber.number,
    'http://lovebomb.herokuapp.com/record.xml?data=' + encodeURI(JSON.stringify(dbData))
  )

  res.send(dbData)
}

exports.sendBombToRecipient = function(req, res){
  /* Perform call */

  dispatcher.call(
    req.query.recipientNumber,
    'http://lovebomb.herokuapp.com/send.xml?' + encodeURI(JSON.stringify(req.query.data))
  )
  res.send(req.query)
}


exports.recordCallDone = function(req, res){
  console.log( "RECORDING", req.query )
  var data = JSON.parse( req.query.data )

  console.log( data )

  var bombRef = dbRef.child( data.id )

  bombRef.child('call').set({
    status: 'done',
    recordingUrl: data.query.recordingUrl
  })

  res.send('true')
  //console.log( req )
}

exports.recordXml = function(req,res){
  console.log( req.query )
  res.render('record', {data:JSON.parse(req.query.data)})
}

exports.sendXml = function(req,res){
  res.render('send', {data:JSON.parse(req.query.data)})
}
