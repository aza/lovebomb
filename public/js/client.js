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
    console.log( data )

    if( data.call && data.call.status == "done" ){

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
      bomberName:   user.displayName,
      bomberNumber: $('#bomberNumber').val(),
      recipientName:   $('#recipientName').val(),
      recipientNumber: $('#recipientNumber').val()
    }

    $('#loggedin').fadeOut()
    $('#starting').fadeIn()

    $.get('startBomb', params, function(data){
      var lovebombRef = new Firebase(FIREBASE_BASE_URL + '/lovebombs/' + data.id)
      lovebombRef.on('value', onLovebombUpdate )
      console.log(data)
      $('#starting').fadeOut()
      $('#telling').fadeIn()
    })
  })



})()
