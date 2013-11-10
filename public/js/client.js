(function(){
  var FIREBASE_BASE_URL = 'https://lovebomb.firebaseio.com/'
  var FB_USERID_KEY = 'fbId'
  var FRIEND_COUNTER = 0

  function onLoggedIn(user){
    $('h1').text('Who needs love?');
    $('.loggedin').show()
    $('.loggedout').hide()
    $('.recipientPortrait').hide()
    $(".addFriend").on("click", function (e) {
      console.log("add friend clicked!");
      addFriendInput();
      e.preventDefault();
    });

    setupFBTypeahead( $('.recipientTypeahead'), onRecipientSelected)

    // Create one friend input by default
    addFriendInput()
  }


  function onLoggedOut(user){
    $('h1').text('LOVEBOMB')
    $('.loggedin').hide()
    $('.loggedout').show()
  }

  function onRecipientSelected(fbUser) {
    console.log("onRecipientSelected");

    var largeProfilePic = 'https://graph.facebook.com/'+fbUser.id+'/picture?width=200&height=200';
    
    $('.recipientPortrait').css("background", "url(" + largeProfilePic + ") no-repeat");
    $('.recipientPortrait').css("background-repeat", "no-repeat");
    $('.recipientPortrait').show()
  }

  function setupFBTypeahead(inputField, onSelectionCallback) {
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
            '<span class="user-name">{{name}}</span>'
        ].join(''),
        engine: Hogan
    });


    inputField.bind('typeahead:selected', function(obj, value) {
      // 'value' contains the object created by filter & map function above
      // Let's store the selected user's FB id into the field
      $(this).attr(FB_USERID_KEY, value.id);

      console.log("setting up typeahead with attr " + $(this).attr(FB_USERID_KEY))

      if (onSelectionCallback) {
        onSelectionCallback(value);
      } 
    });
    inputField.bind("typeahead:autocompleted", function(obj, value) {
        console.log(":autocompleted");
    });

    console.log("setup typeahead");
  }

  function addFriendInput() {
    FRIEND_COUNTER++;

    var friendNameInput = document.createElement('input');
    friendNameInput.type = "text";
    friendNameInput.id = "friend" + FRIEND_COUNTER;
    friendNameInput.class = "friendTypeahead";
    friendNameInput.placeholder = "Friend's name?";
    friendNameInput.value = "";

    var friendPhoneInput = document.createElement('input');
    friendPhoneInput.type = "tel";
    friendPhoneInput.id = "number" + FRIEND_COUNTER;
    friendPhoneInput.placeholder = "Friend's number?";
    friendPhoneInput.value = "";

    $(".friends").append($(friendNameInput));
    $('.friends').append($(friendPhoneInput));

    console.log("addFriendInput");
    console.log(friendPhoneInput);

    // Add autocomplete support to the friend field
    setupFBTypeahead( $(friendNameInput), null );
  }

  function onFriendsUpdate(snapshot, id){
    var data = snapshot.val()
    console.log( "FRIENDS", data, id)

    var lovebombRef = new Firebase(FIREBASE_BASE_URL + 'lovebombs/' + id)


    var allFriendsCalled = true;
    for (var i=0; i< data.length; i++) 
    {
      // If this friend not called yet, call them!
      if( !data[i].call ) {
        $.get('callFriend', {id: id, friendNum:i})
        allFriendsCalled = false;
        break;
      }

      // If this friend called but didn't answer, text them!
      if ((data[i].call && data[i].call.status != "completed") {
        if (!data[i].text || data[i].text.status != "completed") {
        var smsText = bomberName + " is making a lovebomb for " + recipientName + 
                      ". Have 10 seconds to record something you love about them? " + 
                      "http://lovebomb.heroku.com/" + id + "?invite"})


        $.get('textFriend', {id: id, friendNum:i, message: smsText});

        allFriendsCalled = false;
        break;
      }
    }

    if (allFriendsCalled) {
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
    var friendList = [];
    for (i=1; i <= FRIEND_COUNTER; i++) {
      friendList.push({
        name: $("#friend" + i).val(),
        number: $("#number" + i).val(),
        fbId: $("#friend" + i).attr(FB_USERID_KEY)
      })
    }

    var params = {
      bomber:{
        name: user.displayName,
        number: $('#bomberNumber').val(),
        fbId: user.id
      },
      recipient: {
        name: $('#recipientName').val(),
        number: $('#recipientNumber').val(),
        fbId: $('#recipientName').attr(FB_USERID_KEY)
      },
      friends: friendList
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
