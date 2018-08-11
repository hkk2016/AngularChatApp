var data={};
 data.chatId="1";
 data.message="Hi";
var obj={to:data.chatId,message:data.message};
console.log(JSON.stringify(obj));
var a=[1,2,3];
console.log(a.every((x)=>{
    return x<3;
}));