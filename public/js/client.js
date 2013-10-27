(function(){

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


  var lbRef = new Firebase('https://lovebomb.firebaseio.com/')
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
    $.get('startBomb', params, function(data){
      console.log(data)
    })
  })



})()
