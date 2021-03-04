var webSocketServ =require('ws').Server;

var wss=new webSocketServ({port:9090})
var users= {};
wss.on('connection',function(conn){
   console.log("User connected");

   conn.on("message",function(message){
       var data;
       
       try{
           data=JSON.stringify(message);
       }catch(e){
           console.log("Invalid JSON");
           data={};
       }

       switch (data.type){
           case "login":
               if(users[data.name]){
                    sendToOtherUser(conn,{
                        type:"login",
                        success:false
                    })
               }else{
                    users[data.name]=conn;
                    conn.name=data.name;
                    sendToOtherUser(conn,{
                        type:"login",
                        success:true
                    })
               }
            break;
       }
   })

   conn.on("close",function(message){
       console.log("Connection closed");
   })

   conn.send("Hello World");
})

function sendToOtherUser(connection,message){
    connection.send(JSON.stringify(message));
}