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


  function onFriendsUpdate(snapshot){
    var data = snapshot.val()
    console.log( "FRIENDS", data )

    if( data[0].call && data[0].call.status == "completed" ){
      console.log( "ALL DONE WITH FRIENDS" )
      $.get('sendBombToRecipient', {id: snapshot.name()})
    }
  }

  function onBomberUpdate( snapshot ){
    var data = snapshot.val()
    console.log('here', data)

    // TODO: Only do this the first time...
    if( data.bomber.call && data.bomber.call.status == "completed" ){
      $('.starting').hide()
      $('.telling').show()

      $('<audio>')
        .attr({autoplay:'autoplay', controls:'controls'})
        .append( $('<source>').attr({src:data.bomber.call.recordingUrl}))
        .appendTo('.telling')

      $.get('callFriend', {id: snapshot.name(), friendNum:0})

      var lovebombRef = new Firebase(FIREBASE_BASE_URL + 'lovebombs/' + snapshot.name())
      lovebombRef.child('friends').on('value', onFriendsUpdate)
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
      },
      friends: [
        {name: $('#name2').val(), number:$('#number2').val() }
      ]
    }

    $('.loggedin').hide()
    $('.starting').show()

    $.get('startBomb', {data: JSON.stringify(params)}, function(id){
      console.log('hi')
      var lovebombRef = new Firebase(FIREBASE_BASE_URL + 'lovebombs/' + id)
      lovebombRef.child('bomber').once('value', onBomberUpdate )
    })
  })



})()
