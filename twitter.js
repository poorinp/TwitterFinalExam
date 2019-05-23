var Twitter = require('twitter');
var fs = require("fs");
var request = require("request");

var client = new Twitter({
    consumer_key: 't6pFg5ZgxN5d4BaFBHCZIYrn8',
    consumer_secret: 'Di8Tduukg0BFHqjEdCOdMWrnVYnt8aOsxRgQM6k2f7gtNuUYkN',
    access_token_key: '1130323943477239808-pXQnEt4sBkYYLVAQaPg1sdI3t6YwO7',
    access_token_secret: 'Uf4CgSqvkPBdcllW5GiosfmXipi85I9wpgM43jFzxLxB4'
  });

var stream = client.stream('statuses/filter', {track: 'tradewar'});
    stream.on('data', function(event) {
        console.log("Tweeted by ::::>>>" + event.user.name + "           |        Tweeted content :" + event.text);
        fs.appendFile("tweettttt.txt", JSON.stringify(event), function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
    });
    
    stream.on('error', function(error) {
        throw error;
    });