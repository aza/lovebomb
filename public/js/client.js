(function(){
  var FIREBASE_BASE_URL = 'https://lovebomb.firebaseio.com/'

  function onLoggedIn(user){
    $('h1').text('Who needs love?');
    $('.loggedin').show()
    $('.loggedout').hide()
    $('.recipientPortrait').hide()

    setupFBTypeahead( $('.recipientTypeahead') )
    setupFBTypeahead( $('.friendTypeahead') )
  }


  function onLoggedOut(user){
    $('h1').text('LOVEBOMB')
    $('.loggedin').hide()
    $('.loggedout').show()
  }

  function setupFBTypeahead(inputField, optionalMutualFriends) {
    var prefetchUrl = 'https://graph.facebook.com/' + window.user.id + 
        '/friends?fields=id,name,location,timezone' +
        '&access_token=' + window.user.accessToken;

    /*var mutualFriendsUrl = 'https://graph.facebook.com/' + user.id + 
        '/mutualfriends/azaraskin?fields=id,name,location,timezone' +
        '&access_token=' + user.accessToken;*/

    var prefetchOptions = {
        url: prefetchUrl,
        filter: function(parsedResponse) {
            return parsedResponse.data.map( function(fbUser) {
                 return {
                    value: fbUser.name,
                    tokens: fbUser.name.split(" "),
                    name: fbUser.name,
                    id: fbUser.id,
                    location: fbUser.location ? fbUser.location.name : "",
                    profileImageUrl: 'https://graph.facebook.com/' + fbUser.id + '/picture'
                };
            });
        }
    };

    // Setup the typeahead!
    inputField.typeahead({
        suggestions: 'people',
        prefetch: prefetchOptions,
        limit: 5,
        template: [     
            '<img class="user-photo" src="{{profileImageUrl}}"/>',                
            '<span class="user-name">{{name}}</span>',
            '<span class="user-location">{{location}}</span>' 
        ].join(''),
        engine: Hogan
    });


    inputField.bind('typeahead:selected', onRecipientChosen);
    inputField.bind("typeahead:autocompleted", function(obj, value) {
        console.log(":autocompleted");
    });

    console.log("setup typeahead");
  }

  function onRecipientChosen(obj, value) {
    var largeProfilePic = 'https://graph.facebook.com/'+value.id+'/picture?width=200&height=200';
    
    $('.recipientPortrait').css("background", "url(" + largeProfilePic + ") no-repeat");
    $('.recipientPortrait').css("background-repeat", "no-repeat");
    $('.recipientPortrait').show()
  }


  function onFriendsUpdate(snapshot, id){
    var data = snapshot.val()
    console.log( "FRIENDS", data )

    if( data[0].call && data[0].call.status == "completed" ){
      console.log( "ALL DONE WITH FRIENDS" )
      $.get('sendBombToRecipient', {id: id})
    }
  }

  function onBomberUpdate( snapshot, id ){
    var data = snapshot.val()
    console.log('here', data)

    // TODO: Only do this the first time...
    if( data.call && data.call.status == "completed" ){
      console.log( "INSIDE")

      $('.starting').hide()
      $('.telling').show()

      $('<audio>')
        .attr({autoplay:'autoplay', controls:'controls'})
        .append( $('<source>').attr({src:data.call.recordingUrl}))
        .appendTo('.telling')

      $.get('callFriend', {id: id, friendNum:0})

      var lovebombRef = new Firebase(FIREBASE_BASE_URL + 'lovebombs/' + id)
      lovebombRef.child('friends').on('value', function(snapshot){
        onFriendsUpdate(snapshot, id)
      })
    }
  }


  var lbRef = new Firebase(FIREBASE_BASE_URL)
  var auth = new FirebaseSimpleLogin( lbRef, function(error, user){
    if( error ) {console.log("ERROR LOGIN", error)}
    else if(user){
      console.log( "USER ID:", user.id, "Provider:", user.provider, user)
      window.user = user //TODO: Better way to do this?
      onLoggedIn(user)
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
      $('#link a').text('Link To This Lovebomb').attr({'href':'/link?q='+id})
      var lovebombRef = new Firebase(FIREBASE_BASE_URL + 'lovebombs/' + id)
      lovebombRef.child('bomber').on('value', function(snapshot){
        onBomberUpdate(snapshot, id)
      })
    })
  })



})()
