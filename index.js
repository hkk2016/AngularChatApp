var express=require('express');
var http=require('http');
var path = require('path');
var app=express();
var server=http.createServer(app)
var io=require('socket.io')(server);

//This is a model which stores online users.
function user(Name, ChatId){
    this.Name = Name; 
    this.ChatId  = ChatId;
 }

//array which stores the online users.
var onlineUsers=[];


app.use(express.static(path.join(__dirname, 'dist/AngularChatApp')));

//This is an  api which provides the online users to the caller.
app.get('/GetOnlineUsers',function(req,res)
{
    res.json(onlineUsers);
})

//redirect the routes to angular unless it is GetOnlineUSers.
app.get('*',function(req,res)
{
    //console.log(__dirname);
    res.sendFile(__dirname+'/dist/AngularChatApp/index.html')

})

//The below function is not manadatory (just for understanding only)

io.use(function (socket, next) {
    console.log("id from use:" + socket.id);
    // return the result of next() to accept the connection.
    // if (socket.handshake.query.foo == "bar") {
         return next();
    // }
    // // call next() with an Error if you need to reject the connection.
    // next(new Error('Authentication error'));
});

//on new socket connection
io.on('connection',function(socket){
    
    console.log('user is connected ');
    console.log("loggeduser => " +  socket.handshake.query.Name);
    console.log("socket Id="+socket.id);
    //Inserting the users to the list on connection.
    var onlineUser = new user(socket.handshake.query.Name,socket.id);
    onlineUsers.push(onlineUser);
    console.log(JSON.stringify(onlineUsers));
    socket.broadcast.emit('NewUser', "New User Connected");

    //online socket gets disconnected or user close the chat.
    socket.on('disconnect', function(){
        console.log('user disconnected='+socket.id);
        onlineUsers.splice(onlineUsers.findIndex(x=>x.ChatId==socket.id),1);
        console.log("Users Now Available");
        console.log(JSON.stringify(onlineUsers));
        //socket.broadcast.emit('Update', "New User Connected");
        io.sockets.emit('UserDisconnected',socket.id);

      });

      //this handles the message sent from theclient side.
    socket.on('chat message',function(data){
        console.log("message received ,SOcket ID from :"+socket.id+" ,msg:"+data.message,"to socketid:"+data.to+"from :"+data.from);
        var obj={to:data.to,message:data.message,from:data.from};
        // obj.to=data.chatId;
        // obj.message=data.message;
        //io.sockets.emit('get message',obj);
        
        //this  redirects the received message from the client to the respective socke/user.
        socket.broadcast.to(data.to).emit('get message',obj);
        
        // testMsg="This is a test message";
        // socket.broadcast.to(data.connectionID).emit('get message',testMsg);
        // console.log("ConnectionID="+data.connectionID);
        
    })  
});
server.listen(3000,function()
{console.log("Server is Running  on 3000")});



