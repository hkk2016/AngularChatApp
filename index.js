var express=require('express');
var http=require('http');
var path = require('path');
var app=express();
var server=http.createServer(app)
var io=require('socket.io')(server);

function user(Name, ChatId){
    this.Name = Name; 
    this.ChatId  = ChatId;
 }


var onlineUsers=[];





app.use(express.static(path.join(__dirname, 'dist/AngularChatApp')));
app.get('/GetOnlineUsers',function(req,res)
{
    res.json(onlineUsers);
})
app.get('/',function(req,res)
{
    //console.log(__dirname);
    res.sendFile(__dirname+'/dist/AngularChatApp/index.html')

})

io.use(function (socket, next) {
   // console.log("Query: ", socket.handshake.query);
    console.log("id from use:" + socket.id);
    // return the result of next() to accept the connection.
    // if (socket.handshake.query.foo == "bar") {
         return next();
    // }
    // // call next() with an Error if you need to reject the connection.
    // next(new Error('Authentication error'));
});

io.on('connection',function(socket){
    
    console.log('user is connected ');
    console.log("loggeduser => " +  socket.handshake.query.Name);
    console.log("socket Id="+socket.id);
    //Inserting the users to the list on connection.
    var onlineUser = new user(socket.handshake.query.Name,socket.id);
    onlineUsers.push(onlineUser);
    console.log(JSON.stringify(onlineUsers));
    socket.broadcast.emit('NewUser', "New User Connected");


    socket.on('disconnect', function(){
        console.log('user disconnected='+socket.id);
        onlineUsers.splice(onlineUsers.findIndex(x=>x.ChatId==socket.id),1);
        console.log("Users Now Available");
        console.log(JSON.stringify(onlineUsers));
        //socket.broadcast.emit('Update', "New User Connected");
        io.sockets.emit('UserDisconnected',socket.id);

      });
    socket.on('chat message',function(data){
        console.log("message received ,SOcket ID from :"+socket.id+" ,msg:"+data.message,"to socketid:"+data.to+"from :"+data.from);
        var obj={to:data.to,message:data.message,from:data.from};

        // obj.to=data.chatId;
        // obj.message=data.message;
        //io.sockets.emit('get message',obj);
        socket.broadcast.to(data.to).emit('get message',obj);
        
        // testMsg="This is a test message";
        // socket.broadcast.to(data.connectionID).emit('get message',testMsg);
        // console.log("ConnectionID="+data.connectionID);
        
    })  
});
server.listen(3000,function()
{console.log("Server is Running  on 3000")});



