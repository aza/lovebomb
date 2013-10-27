(function(){

  function onLoggedIn(user){
    $('h1').text('Hello, ' + user.first_name)
    $('h2').text('from ' + user.hometown.name)
  }


  function onLoggedOut(user){
    $('h1').text('LOVEBOMB')
    $('h2').empty()
  }


  var lbRef = new Firebase('https://lovebomb.firebaseio.com/')
  var auth = new FirebaseSimpleLogin( lbRef, function(error, user){
    if( error ) {console.log("ERROR LOGIN", error)}
    else if(user){
      console.log( "USER ID:", user.id, "Provider:", user.provider, user)
      onLoggedIn(user)
    }
    else{
      console.log("logged out")
      onLoggedOut(user)
    }
  })

  $('#login').click(function(){
    auth.login('facebook')
  })

  $('#logout').click(function(){
    auth.logout()
  })


})()
