const http = require('http').createServer(response)
const fs = require('fs')
const io = require('socket.io')(http)
const chatPort = 3001

var users = []; // Lista de usuários
var last_messages = []; // Lista com ultimas mensagens enviadas no chat

  http.listen(chatPort)
  console.log(`Chat server listening at http://localhost:${chatPort}`)

  function response (req, res) {
    var file = ""
    if(req.url == "/"){
      file ='./public/index.html'
    }else{
      file = './public' + req.url
    }
    fs.readFile(file,
      function (err, data) {
        if (err) {
          res.writeHead(404)
          return res.end('Page not found')
        }
  
        res.writeHead(200)
        res.end(data)
      }
    )
  }
  
  io.on("connection", function(socket){
    // Method to responding the enter event
    socket.on("login", function(nickname, callback){
      if(!(nickname in users)){
        socket.nickname = nickname
        users[nickname] = socket // Add the username to the list stored on the server
  
        // Send the latest stored messages to the new user.
        for(index in last_messages){
          socket.emit("updade messages", last_messages[index])
        }
  
  
        var message = "[ " + getCurrentDate() + " ] " + nickname + " enter the chat"
        var obj_message= {msg: message, type: 'system'}
  
        io.sockets.emit("update users", Object.keys(users))// Sending the new list of users
        io.sockets.emit("update messages", obj_message) // Sending message announcing new user entry
  
        storesMessage(obj_message) // Saving the message in the history list
        callback(true)
      }else{
        callback(false)
      }
    })
  
  
    socket.on("send message", function(datas, callback){
  
      var message_sent = datas.msg
      var user = datas.usu
      if(user == null)
        user = '' // If you don't have a user, the message will be sent to everyone in the room
  
      message_sent = "[ " + getCurrentDate() + " ] " + socket.nickname + " says: " + message_sent
      var obj_message = {msg: message_sent, type: ''}
  
      if(user == ''){
        io.sockets.emit("update messages", obj_message)
        storesMessage(obj_message) // Storing the message
      }else{
        obj_message.type = 'private'
        socket.emit("update messages", obj_message) // Sending the message to the user who sent it
        users[user].emit("update messages", obj_message) // Sending the message to the chosen user
      }
      
      callback();
    });
  
    socket.on("disconnect", function(){
      delete [socket.nickname]
      var message = "[ " + getCurrentDate() + " ] " + socket.nickname + " left the chat"
      var obj_message = {msg: message, type: 'system'}
  
  
      /*
        If a user leaves, the user list is updated
        along with a notice in a message to room participants
      */	
      io.sockets.emit("update users", Object.keys(users))
      io.sockets.emit("update messages", obj_message)
  
      storesMessage(obj_message)
    })
  
  })
  
  
 // Function to present a String with the date and time in DD/MM/YYYY HH:MM:SS format
  function getCurrentDate(){
    var currenDate = new Date()
    var day = (currenDate.getDate()<10 ? '0' : '') + currenDate.getDate()
    var month = ((currenDate.getMonth() + 1)<10 ? '0' : '') + (currenDate.getMonth() + 1)
    var year = currenDate.getFullYear();
    var hour = (currenDate.getHours()<10 ? '0' : '') + currenDate.getHours()
    var minutes = (currenDate.getMinutes()<10 ? '0' : '') + currenDate.getMinutes()
    var seconds = (currenDate.getSeconds()<10 ? '0' : '') + currenDate.getSeconds()
  
    var formatDate = day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds
    return formatDate
  }
  
// Function to store messages and their type in the last messages variable
  function storesMessage(message){
    if(last_messages.length > 5){
      last_messages.shift()
    }
  
    last_messages.push(message)
  }