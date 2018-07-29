var express=require('express');
var http=require('http');
var path = require('path');
var app=express();
var server=http.createServer(app)
var io=require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'dist/AngularChatApp')));
app.get('/',function(req,res)
{
    //console.log(__dirname);
    res.sendFile(__dirname+'/dist/AngularChatApp/index.html')

})
io.on('connection',function(socket){
    
    console.log('user is connected ');
    //console.log("socket Id="+socket.id);
    socket.on('disconnect', function(){
        console.log('user disconnected');
      });
    socket.on('chat message',function(data){
        
        console.log("SOcket ID:"+socket.id+" ,msg:"+data);
        
        socket.broadcast.emit('get message',data);
        
        // testMsg="This is a test message";
        // socket.broadcast.to(data.connectionID).emit('get message',testMsg);
        // console.log("ConnectionID="+data.connectionID);
        
    })  
});
server.listen(3000,function()
{console.log("Server is Running  on 3000")});



