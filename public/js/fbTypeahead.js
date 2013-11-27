function enableFBTypeahead(element, accessToken, mutualFriends) {
    var accessToken = user.accessToken;
    var prefetchUrl = 'https://graph.facebook.com/' + user.id + 
        '/friends?fields=id,name,location,timezone' +
        '&access_token=' + accessToken;

    /*var mutualFriendsUrl = 'https://graph.facebook.com/' + user.id + 
        '/mutualfriends/azaraskin?fields=id,name,location,timezone' +
        '&access_token=' + accessToken;*/

    var prefetchOptions = {
        url: prefetchUrl,
        ttl: 86400000,
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

    // single dataset
    var fbUserField = $('input.typeahead');
    fbUserField.typeahead({
        suggestions: 'people',
        local: '/js/countries.json',
        limit: 10
        template: [     
            '<img class="user-photo" src="{{profileImageUrl}}"/>',                
            '<span class="user-name">{{name}}</span>',
            '<span class="user-location">{{location}}</span>' 
        ].join(''),
        engine: Hogan
    });



    fbUserField.bind('typeahead:selected', function(obj, value) {
        console.log(":selected");
        console.log(value);

        /*var largeProfilePic = 'https://graph.facebook.com/'+value.id+'/picture?width=200&height=200';
        $('div.loveRecipientFrame').css("background", "url(" + largeProfilePic + ") no-repeat");*/

        //$('div.loveRecipientFrame').css("background-repeat", "no-repeat");
    });

    fbUserField.bind("typeahead:autocompleted", function(obj, value) {
        console.log(":autocompleted");

    });

    console.log("setup typeahead");
    //$('input.typeahead').typeahead('destroy');
}