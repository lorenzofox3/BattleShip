/**
 * Created with JetBrains WebStorm.
 * User: laurentrenard
 * Date: 12/4/12
 * Time: 3:24 PM
 * To change this template use File | Settings | File Templates.
 */
app.controller('gameCtrl',['$scope','socket','game','$log',function(scope,socket,game,log){

    //after resolving the route
    scope.room=game;

    //connect a socket to the server in the right room:
    socket.emit('connection');
    socket.emit('join',{roomId:scope.room.ref});

    //phase management
    scope.currentPhase='placement';
    scope.$on('ready',function(){
       scope.currentPhase='play';
    });

    //log the message
    socket.on('message',function(args){
        log.log(args.message);
    });

    socket.on('finish',function(args){
        scope.$emit('displayOverlay',{});
    });
}]);