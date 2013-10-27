
/*
 * GET home page.
 */

var dispatcher = require('../love_dispatcher')

exports.index = function(req, res){
  res.render('index');
};

exports.callBomber = function(req, res){
  /* Perform call */
  // TODO: Add proper error handling for query
  dispatcher.callBomber( req.query.number )
  res.send('ID OF PHONE CALL')
}

exports.callRecipient = function(req, res){
  /* Perform call */
  res.send('ID OF PHONE CALL')
}


exports.recording = function(req, res){
  console.log( "RECORDING" )
  //console.log( req )
}
