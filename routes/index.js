
/*
 * GET home page.
 */

var dispatcher = require('../love_dispatcher'),
    Firebase = require('firebase'),
    params = require('../params').params

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
    'http://lovebomb.herokuapp.com/record.xml?' + params({data:dbData})
  )

  res.send(dbData)
}

exports.sendBombToRecipient = function(req, res){
  /* Perform call */

  dispatcher.call(
    req.query.recipientNumber,
    'http://lovebomb.herokuapp.com/send.xml?' + params({data:req.query.data})
  )
  res.send(req.query)
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

exports.recordXml = function(req,res){
  console.log( req.query )
  res.render('record', JSON.parse(req.query.data))
}

exports.sendXml = function(req,res){
  res.render('send', JSON.parse(req.query.data))
}
