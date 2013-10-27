
/*
 * GET home page.
 */

var dispatcher = require('../love_dispatcher'),
    Firebase = require('firebase'),
    params = require('../params')

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
    },

    call: {
      status: 'in-progress',
      recordingUrl: null
    },

    recipient: {
      number: req.query.recipientNumber,
      name: req.query.recipientName
    }
  }



  var item = dbRef.push( dbData )
  var id = item.name()

  var actionUrl = 'http://lovebomb.herokuapp.com/record.xml?'
                    + params({
                      id: id,
                      recipientName: req.query.recipientName
                    })
  dispatcher.call( req.query.bomberNumber, actionUrl )
  dbData.id = id
  res.send(dbData)
}

exports.sendBombToRecipient = function(req, res){
  /* Perform call */


  var actionUrl = 'http://lovebomb.herokuapp.com/send.xml?'
                    + params({
                      bomberName: req.query.bomberName,
                      recordingUrl: req.query.recordingUrl
                    })
  dispatcher.call( req.query.recipientNumber, actionUrl )
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
  res.render('record', {id: req.query.id, recipientName:req.query.recipientName })
}

exports.sendXml = function(req,res){
  res.render('send', {
    id: req.query.id,
    bomberName: req.query.bomberName,
    recordingUrl: req.query.recordingUrl
  })
}
