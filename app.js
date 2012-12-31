
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    data=require('./routes/data.js'),
    game=require('./routes/game.js'),
    config=require('./serverConfig.js');

var app = module.exports = express();
var server = require('http').createServer(app);

// Hook Socket.io into Express
var io = require('socket.io').listen(server);

// Configuration

app.configure(function(){
    //rendering engine is jade
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    //public files
    app.use(express.static(__dirname + '/public'));
    //game directory
    app.use('/game',express.static(__dirname+'/public/game'));

    //handle authentication and session
    app.use(express.bodyParser());
    app.use(express.methodOverride());
//    app.use(express.cookieParser(config.cookieSecret));
//    app.use(express.cookieSession());
    //api verb
    app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);
app.get('/game/templates/:name',game.templates);


/****************
*      API      *
*****************/

//create a game
app.post('/battleshipapi/rooms',function(req,res,next){
    //res.send(401);
    next();
},function(req,res){
    //'new is a dummy variable for now
    data.createRoom('new');
    //send the updated list
    res.json(201,data.all());
});

//get all rooms
app.get('/battleshipapi/rooms',function(req,res){
    res.json(200,data.all());
});

//get a particular room
app.get('/battleshipapi/rooms/:ref',function(req,res){
    var ref=req.params.ref;
    var room=data.reference(ref);
    if(room!==null){
        //game is full
        if(room.count(ref)>=2){
            console.log('403');
            res.send(403)//forbidden
        }
        else{
            //everything is fine
            console.log('200');
            return res.json(200,data.room(ref));
        }
    }else{
        //not found
        console.log('404');
        res.send(404);
    }
});

//delete a game
app.delete('/battleshipapi/rooms/:ref',function(req,res){
    var id=req.params.ref;
    if(data.deleteRoom(id)){
        res.json(200,data.all());
    }
    else{
        res.send(404);
    }
});

// redirect all others to the index (HTML5 history)
//app.get('*', routes.index);

/***********************
 *      Sockets        *
 ***********************/

function leave(socket,room){
    if(room!==null){
        room.leave(socket);
        //game is over ...
        var players=room.all();
        for (var i = 0; i < players.length; i++) {
            players[i].socket.emit('finish', {});
        }
    }
}

io.sockets.on('connection', function(socket,args){
    var player=null;
    var room=null;

    //leave
    socket.on('disconnect',function(args){
        leave(socket,room);
    });

    socket.on('leave',function(args){
        console.log(leave);
        leave(socket,room);
    });

    //connection has been made : we try to join the room
    //but if we have manage to connect it is likely that we can join the room.
    socket.on('join',function(arg){
        if(data.join(socket,arg.roomId)){
            //set "global variable" for closures
            room=data.reference(arg.roomId);
            player=room.get(socket);
            socket.emit('message',{message:'welcome'});
        }
        else{
            socket.emit('message',{message:'was not able to join the game'});
        }
    });

    //a player is ready to play
    socket.on('play',function(playerData){
        //should always be true
        if (room!==null && player!==null) {
            //check whether the argument are corrects
            if (playerData.grid && playerData.boats) {
                //make sure the boat haven't been set yet
                if (player.grid === undefined && player.boats === undefined) {
                    player.grid = playerData.grid;
                    player.boats = playerData.boats;
                    var health=0;
                    for(var i=0;i<player.boats.length;i++){
                        health+=player.boats[i].health
                    }
                    player.health=health;
                    player.isReady=true;
                    socket.emit('message', {message:'player ' + ' ready to play'});
                }
                //if we have our two players
                if (room.count() == 2) {
                    //if both are ready we can start
                    var players=room.getPlayers();
                    if (players[0].isReady && players[1].isReady) {
                        var firing = room.current();
                        if (firing !== null) {
                            //give right to shoot
                            firing.socket.emit('shoot');
                        }
                    }
                }
            }
            else {
                socket.emit('message', {message:'error : argument missing'});
            }
        }
    });

    //a player has shot
    socket.on('fire',function(args){
        if (room!==null) {
            var current = room.current();
            if (current.socket == socket) {
                var target = room.other(current.socket);
                //check if have proper data
                if (args.row !== undefined && args.column !== undefined) {
                    //result to the player who fired
                    //call check only once (it reduces the health)
                    var result = room.check(target.socket, args.row, args.column);
                    socket.emit('result', {row:args.row, column:args.column, result:result});
                    //result to the target
                    target.socket.emit('target', {row:args.row, column:args.column, result:result});
                    //finish
                    if (target.health==0) {
                        var players = room.all();
                        for (var i = 0; i < players.length; i++) {
                            players[i].socket.emit('finish', {});
                        }
                    }
                    //change the player whom turn is and warn it (the other will know with the result)
                    room.update();
                    target.socket.emit('shoot');
                }
                else {
                    socket.emit('message', {message:'error : row and column are required'});
                }
            } else {
                socket.emit('message', {
                    message:'error : it is not your turn'
                });
            }
        }
    });

    //chat (broadcast to all)
    socket.on('chatMessage',function(args){
        if(room!==null){
            var players=room.all();
            for(var i=0;i<players.length;i++){
                players[i].socket.emit('chatMessage',{author:args.author,message:args.message});
            }
        }
    });
});

// Start server
server.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
