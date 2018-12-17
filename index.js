'use strict';

// put your own value below!
const clientId = '26dd2b221ac14593bafa265425b2a0ce'; 
const authEndpoint = 'https://accounts.spotify.com/authorize';
const redirectUri = "https://AnxiousVioletredUser-1--teachermarinam.repl.co/";

// Get the hash of the url
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const scopes = [
  'user-read-birthdate',
  'user-read-email',
  'user-read-private'
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

// Make a call using the token
$.ajax({
   url: "https://api.spotify.com/v1/me/top/artists",
   type: "GET",
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
   success: function(data) { 
     // Do something with the returned data
     data.items.map(function(artist) {
       let item = $('<li>' + artist.name + '</li>');
       item.appendTo($('#top-artists'));
     });
   }
});

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${(key)}=${(params[key])}`)
  return queryItems.join('&');

}

/*
function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.length; i++){
    // for each object in the items 
    //array, add a list item to the results 
    //list with the full name, description,
    //and url
    $('#results-list').append(
      `<li><h3>${responseJson[i].items.href}</h3>
      <p>${responseJson[i].name}</p>
      //<a href='${responseJson[i].uri}' target='_blank'>link here</a>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};


function getSongs(query, limit=50, integer) {
  const params = {
    client_id: clientId,
    response_type: 'token',
    //type: "track,album",
    //limit,
    redirect_uri:"https://songfinder--teachermarinam.repl.co/",
    q:query,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url, {mode: 'no-cors'})
    .then(response => {
      if (response.ok) {
        console.log(response);
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      console.log(responseJson);
      displayResults(responseJson.data);
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}*/

function getSongs(query, limit=50, integer) {
  fetch("https://api.spotify.com/v1/search?q=Muse&type=track%2Cartist&market=US&limit=10&offset=5",
  {
    mode: 'cors',
    headers: {
       'Authorization': 'Bearer ' + _token
    }
  })
  .then(res => {
    console.log(res);
  })
  .then(data => {
    console.log(data);
  })
  .catch(err => console.log(err.message))
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getSongs(searchTerm, maxResults);
  });

}

$(watchForm);