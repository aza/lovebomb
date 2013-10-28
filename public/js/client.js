(function(){
  var FIREBASE_BASE_URL = 'https://lovebomb.firebaseio.com/'


  function onLoggedIn(user){
    $('h1').text('Hello, ' + user.first_name)
    $('.loggedin').show()
    $('.loggedout').hide()
  }


  function onLoggedOut(user){
    $('h1').text('LOVEBOMB')
    $('.loggedin').hide()
    $('.loggedout').show()

  }

  function onLovebombUpdate( snapshot ){
    data = snapshot.val()

    console.log( "DATA", data )

    if( data.call && data.call.status == "done" ){
      $('.starting').hide()
      $('.telling').show()

      $('<audio>')
        .attr({autoplay:'autoplay', controls:'controls'})
        .append( $('<source>').attr({src:data.call.recordingUrl}))
        .appendTo('.telling')

      $.get('sendBombToRecipient', {
        id: snapshot.name(),
        bomberName: data.bomber.name,
        recipientNumber: data.recipient.number,
        recordingUrl: data.call.recordingUrl
      })
    }
  }


  var lbRef = new Firebase(FIREBASE_BASE_URL)
  var auth = new FirebaseSimpleLogin( lbRef, function(error, user){
    if( error ) {console.log("ERROR LOGIN", error)}
    else if(user){
      console.log( "USER ID:", user.id, "Provider:", user.provider, user)
      onLoggedIn(user)
      window.user = user //TODO: Better way to do this?
    }
    else{
      console.log("logged out")
      window.user = null
      onLoggedOut(user)
    }
  })

  $('#login').click(function(){
    auth.login('facebook')
  })

  $('#logout').click(function(){
    auth.logout()
  })

  $('#submit').click(function(){
    var params = {
      bomber:{
        name: user.displayName,
        number: $('#bomberNumber').val()
      },
      recipient: {
        name: $('#recipientName').val(),
        number: $('#recipientNumber').val()
      }
    }

    $('.loggedin').hide()
    $('.starting').show()

    $.get('startBomb', {data: JSON.stringify(params)}, function(data){
      console.log( data )
      console.log( 'lovebombRefUrl', FIREBASE_BASE_URL + 'lovebombs/' + data )
      var lovebombRef = new Firebase(FIREBASE_BASE_URL + 'lovebombs/' + data)
      lovebombRef.on('value', onLovebombUpdate )
      console.log(data)
    })
  })



})()
