const express = require('express')
const path = require('path')
const cors = require('cors')
const Twitter = require('twitter')
const socketIO = require('socket.io')
const firebase = require('firebase')
const fs = require('fs')

var client = new Twitter({
    consumer_key: 't6pFg5ZgxN5d4BaFBHCZIYrn8',
    consumer_secret: 'Di8Tduukg0BFHqjEdCOdMWrnVYnt8aOsxRgQM6k2f7gtNuUYkN',
    access_token_key: '1130323943477239808-pXQnEt4sBkYYLVAQaPg1sdI3t6YwO7',
    access_token_secret: 'Uf4CgSqvkPBdcllW5GiosfmXipi85I9wpgM43jFzxLxB4'
  });

  firebase.initializeApp({
    apiKey: "AIzaSyDjWkmptAr2qqdbxQntunOSmUj6edsqSpo",
    authDomain: "tradewar.firebaseapp.com",
    databaseURL: "https://tradewar.firebaseio.com",
    projectId: "tradewar",
    storageBucket: "tradewar.appspot.com",
    messagingSenderId: "1018202505660",
    appId: "1:1018202505660:web:b43363bb8038419e"
})

const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname, 'web')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/web/chart.html'))
})
const http = app.listen(process.env.PORT || 3000, () => {
  console.log('server started')
})

/* Steaming logic */
let count = 0
let status = 'listening'

setInterval(() => {
  if (status === 'listening') {
    const event = { count, time: Date.now() }
    console.log('counting')
    io.sockets.emit('count', event)
    firebase
      .database()
      .ref()
      .push(event)
    count = 0
  }
}, 60 * 1000)

const io = socketIO.listen(http)

io.on('connection', client => {
  console.log('user connected')
  io.sockets.emit('count', { count, time: Date.now() })
  io.sockets.emit('status', status)
  client.on('disconnect', () => {
    console.log('user disconnected')
  })
})

const listen = () => {
  const stream = client.stream('statuses/filter', { track: 'tradewar' })
  stream.on('data', event => {
    if (event) {
      count++;
      status = 'listening';
      io.sockets.emit('status', 'listening');
      io.sockets.emit('tweet', event.text);
      // fs.appendFile("tweettttt.txt", JSON.stringify(event), function (err) {
      //   if (err) throw err;
      //   console.log('Saved!');
      // });
    }
  })

  stream.on('error', function(error) {
    console.log(error)
    status = 'cooling'
    console.log('cooling down')
    io.sockets.emit('status', status)
    stream.destroy()
    setTimeout(() => {
      listen()
    }, 60 * 1000)
  })
}

listen()