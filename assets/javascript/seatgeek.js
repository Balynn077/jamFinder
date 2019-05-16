
  // constructing a queryURL variable we will use instead of the literal string inside of the ajax method

var latStart;
var lonStart;
var numPages = 1;
var genreTerm;
var priceTerm;
var startDateTerm;
var endDateTerm;
var player;

$('#dateSelect').css('color','gray');

//load the IFrame Player API code asynchronously
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Function to change video 
function changeVideo(eventTitle){
  $('#player').show();
  // console.log(eventTitle);
  var API_KEY = "AIzaSyBDl0SaDnpnhP7TrxEnPAaXKFIKWHQuUoA";
  var q = eventTitle;
  var part = "snippet";
  var type = "video";
  var baseURL = "https://www.googleapis.com/youtube/v3/search";
  var numberResults = "2";
  var queryURL = baseURL + "?" + "part=" + part + "&q=" + q + "&type=" + type + "&maxResults=" + numberResults +"&key=" + API_KEY;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    var videoToPlay = response.items[0].id.videoId;
    // console.log(videoToPlay);
    player.loadVideoById(videoToPlay);
  });
};

// This function creates an <iframe> (and YouTube player) after the API code downloads.
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '350px',
    width: 100 + '%',
    videoId: "videoToPlay",
   class: "video-container",
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// The API calls this function when the player's state changes.
// The function indicates that when playing a video (state=1),
// the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    // setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}


  function getLocation() {
  if (navigator.geolocation) {
    $('#spinner').show();
    //IF USER GRANTS THE LOCATION IT RUNS THE FUNCTION 'show position'
    navigator.geolocation.getCurrentPosition(showPosition);
    
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
  }
    function showPosition(location) {
      $('.locSpinner').hide();
      $('.begin').hide();
      $('#mainForm').show();
      latStart = (location.coords.latitude);
      lonStart = (location.coords.longitude);
      console.log(lonStart);
      console.log(latStart);
    }

    function tryAgain(){
      $("table tbody").empty();
      $("html, body").animate({ scrollTop: 0 }, "slow");
      $('#player').hide();
    }

    function paginationNextFunction() {
       
    }
$(document).ready(function () { 
      getLocation();
      $('.tap-target').tapTarget();
      $('select').formSelect();
      $('#youtubeDiv').hide();
      $('#mainForm').hide();
      $('#resultsDiv').hide()
      $('.tableRow').hide();
      $('#spinner').show()
      $('#player').hide();
    
    $('form').submit(function(evt) {
      $('#youtubeDiv').show();
      $('#resultsDiv').show();
      $('.tableRow').show();
   
      evt.preventDefault();
      formData= new FormData(evt.target);
    
      //Dates parsed here 
      switch (formData.get('dateSelect')){
        case "Today":
          console.log('today processed');
          startDateTerm = moment().format('MM-DD-YYYY');
          endDateTerm =  moment().format('MM-DD-YYYY');
          break;
        case "Tomorrow":
          console.log ('tom. proccessed');
          startDateTerm = moment().add(1, 'd').format('MM-DD-YYYY');
          endDateTerm = moment().add(1, 'd').format('MM-DD-YYYY');
          break;
        case "This Weekend":
          console.log (' this weekend processed');
          weekend = getWeekendDates();
          startDateTerm = weekend.Friday;
          endDateTerm = weekend.Sunday;
          break;
        case "This Month":
          console.log ('month processed');
          startDateTerm = moment().format('MM-DD-YYYY');
          endDateTerm = moment().date(31).format('MM-DD-YYYY');
          console.log (endDateTerm + "is the last day of the month");
          break;
        case "Next Month":
          console.log ('next month processed');
          startDateTerm = moment().add(1, 'M').date(1).format('MM-DD-YYYY');
          endDateTerm = moment().add(1, 'M').date(31).format('MM-DD-YYYY');  //investigate/fix off by one day 
          console.log (startDateTerm + "is the 1st of next month. " +endDateTerm + "is the last day of next month");
          break;
      }
      genreTerm = formData.get('genreSelect');
      priceTerm = formData.get('priceSelect');
      $("table tbody").empty();

      getConcertByLatLon(latStart, lonStart, "200mi", priceTerm, startDateTerm, endDateTerm, genreTerm);
    });
    

//returns an object with friday's date and sunday's date
    function getWeekendDates(){
      thisFriday = moment().day(5).format('MM-DD-YYYY');
      thisSunday = moment().day(7).format('MM-DD-YYYY');
      return {"Friday": thisFriday, "Sunday": thisSunday};
    }
  
      function getConcertByLatLon(lat, lon, range, ticketPrice, datetimeStart, datetimeEnd, genre){
        $("table tbody").empty();
        var client_id = "MTEyMTc0NzN8MTU1NzM0NDE0OS40OA";
        var client_secret = "d6005bfa21771638a4b460529bda0a83178316ba8c20d7ed24f0a383973f6246";
        // var listingCount = "10";
        var baseURL = "https://api.seatgeek.com/2/"; 
        var endpoint = "events";

        var lat = lat;
        var latString = "&lat=" + lat

        var lon = lon;
        var lonString = "&lon=" + lon

        var range = range;
        var rangeString = "&range.lte=" + range

        if (ticketPrice){
          var ticketPrice = ticketPrice;
        }
        else{
          var ticketPrice = 100000;
        }

        var ticketPriceString = "&lowest_price.lte=" + ticketPrice; 
        
        if (datetimeStart){
          var datetimeStart = datetimeStart;  
          var datetimeEnd = datetimeEnd;
        }
        else {
          var datetimeStart = moment().format('MM-DD-YYYY');
          var datetimeEnd = moment().add(2,'M').format('MM-DD-YYYY');
        }
        var datetimeStartString = "&datetime_local.gte=" + datetimeStart;
        var datetimeEndString = "&datetime_local.lte=" + datetimeEnd;                
        var datetimeTodayString = "&datetime_local.gt=" + datetimeStart;

        var taxonomy = "concert";
        var taxonomyString = "&taxonomies.name=" + taxonomy;

        var genre = genre;
        if (genre){
          var genreString = "&genres.slug=" +genre;
        }
        else genreString = "";

        if (datetimeStart === datetimeEnd) {

          datetimeEnd = (moment(datetimeStart).add(1, 'd').format('MM-DD-YYYY'));

          queryURL = baseURL + endpoint + "/?client_id=" + client_id + "&client_secret="
            + client_secret + latString + lonString + rangeString + ticketPriceString
            + datetimeTodayString + "&datetime_local.lt=" + datetimeEnd+ taxonomyString +genreString; 
        }
        
        else {

          queryURL = baseURL + endpoint + "/?client_id=" + client_id + "&client_secret="
          + client_secret + latString + lonString + rangeString + ticketPriceString
          + datetimeStartString + datetimeEndString + taxonomyString + genreString;
        }

        console.log ("price string:" + ticketPriceString);
        console.log ('datetimeStartString: '+datetimeStartString);
        console.log ('datetimeEndString: ' + datetimeEndString);
        console.log ('genreString: ' + genreString);
        

        console.log(queryURL);

        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
            // console.log(response);
            console.log("There are " + response.events.length + "results.")
            console.log(response.events);
            for (i = 0; i < response.events.length; i++){
              if (response.events[i].performers[0].genres){
              var genreGen = response.events[i].performers[0].genres[0].name;
              console.log('the genre of the event is: ' + genreGen);
              }
              else {
                var genreGen = "N/A"
                console.log("Genre for this result not found");
              }
              // console.log(response.events[0].title);
              var eventTitle = response.events[i].title;
              // console.log(response.events[0].venue.name);
              var venueName = response.events[i].venue.name;
              // console.log(response.events[0].datetime_local);
              var eventLocalTime = response.events[i].datetime_local;

              var fields = eventLocalTime.split("T");
              date = fields[0];
              date = moment(date).format("MM-DD-YYYY");
              time = fields[1];
              console.log(time);
              timez = moment(time, 'H:mm:ss').format('hh:mm a')
              console.log('the date of this show is: ' + date);
              console.log('the time of this show is: ' + timez);
    
              // console.log(response.events[0].stats.average_price);
              var eventAveragePrice = response.events[i].stats.median_price;
              var eventUrl = response.events[i].venue.url;
              // if statement to replace null
              if (eventAveragePrice === null){
                eventAveragePrice = "Price Un-Listed";
              } else {
                eventAveragePrice = "$" + response.events[i].stats.average_price;
              }
              var tableLineData = "<tr><td>" + "<a href=" + eventUrl + ">" + venueName +
                "</a>" + "</td><td>" + date + "</td><td>" + timez + "</td><td id='artistsName'>" +
                eventTitle + "</td><td>" + eventAveragePrice +
                '<td><img onClick="changeVideo(\'' + eventTitle + '\')" class=" hoverable" src="./assets/images/yt_icon_mono_light.png" style="width: 2em; height: 2em;"/></td>';

                
              $("table tbody").append(tableLineData);
            };
        });

      }

      

// POPUP CORNER JS
// Or with jQuery
    
  }); //end document ready
     